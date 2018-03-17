import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { combine, Ingredient } from 'recipe-ingredient-parser';

interface Recipe {
  ingredients?: { [key: string]: Ingredient };
  ingredientText?: string;
}

admin.initializeApp(functions.config().firebase);

function getParam(event: functions.Event<functions.database.DeltaSnapshot>, paramName: string): string {
  return (event.params && event.params[paramName]) || '';
}

export const cleanupAccountData = functions.database.ref('/accounts/{account_id}').onDelete(event => {
  const accountId = getParam(event, 'account_id');
  const updates = {
    [`/scheduledRecipes/${accountId}`]: null,
    [`/recipes/${accountId}`]: null
  };
  return admin.database().ref().update(updates);
});

export const cleanupUserData = functions.auth.user().onDelete(async event => {
  const uid = event.data.uid;
  const accountId = await admin.database().ref(`/users/${uid}/accountId`).once('value').then(res => res.val());
  const updates = {
    [`/users/${uid}`]: null,
    [`/accounts/${accountId}/users/${uid}`]: null
  };
  return admin.database().ref().update(updates);
});

export const createNewUser = functions.auth.user().onCreate(async event => {
  const uid = event.data.uid;
  const email = event.data.email;
  // TODO: Find out how you tell if they are anonymous
  const accountId = admin.database().ref(`/accounts`).push({ users: { [uid]: true } }).key;
  const userInvites = await admin.database().ref(`/invites`).orderByChild('email').equalTo(email).once('value').then(res => res.val());
  const userNotifications = await notifyUserOfAccountInvite(uid, email, userInvites);
  const updates = { [`/users/${uid}/accountId`]: accountId, ...userNotifications };
  return admin.database().ref().update(updates);
});

const notifyUserOfAccountInvite = async (userId: string, email: string, userInvites: { [key: string]: any } | null) => {
  return Object.keys(userInvites || {}).reduce((acc, inviteId) => {
    const key = admin.database().ref().push().key as string;
    const { invitedBy, timestamp } = userInvites && userInvites[inviteId];
    return Object.assign(acc, {
      [`users/${userId}/notifications/${key}`]: {
        inviteId,
        invitedBy,
        message: 'You have been invited to an account!',
        messageType: 'account_invitation',
        timestamp
      }
    });
  }, {});
};

export const inviteUserIfExists = functions.database.ref('/invites/{invite_id}').onCreate(async event => {
  const inviteId = getParam(event, 'invite_id');
  const { email } = event.data.val();
  const userId = await admin.auth().getUserByEmail(email).then(res => res.uid);
  if (userId) {
    const userInvites = await admin.database().ref(`/invites/${inviteId}`).once('value').then(res => res.val());
    const userNotifications = await notifyUserOfAccountInvite(userId, email, { [inviteId]: userInvites });
    return admin.database().ref().update(userNotifications);
  }
});

export const cleanupDeletedRecipe = functions.database.ref('/recipes/{account_id}/{recipe_id}').onDelete(async event => {
  const accountId = getParam(event, 'account_id');
  const eventRecipeId = getParam(event, 'recipe_id');

  const scheduledRecipeIds = await admin.database().ref(`/scheduledRecipes/${accountId}`).orderByChild('recipeId').equalTo(eventRecipeId).once('value').then(res => res.val());

  const updates = Object.keys(scheduledRecipeIds).reduce((acc, scheduledId) => {
    return Object.assign(acc, { [`/scheduledRecipes/${accountId}/${scheduledId}`]: null });
  }, {});

  return admin.database().ref().update(updates);
});

export const cleanupDeletedCategory = functions.database.ref('/categories/{account_id}/{category_id}').onDelete(async event => {
  const accountId = getParam(event, 'account_id');
  const eventCategoryId = getParam(event, 'category_id');

  const recipesWithCategory = await admin.database().ref(`/recipes/${accountId}`).orderByChild(`categories/${eventCategoryId}`).equalTo(true).once('value').then(res => res.val());
  let updates = {};

  for (const recipeId of Object.keys(recipesWithCategory)) {
    updates = Object.assign(updates, { [`/recipes/${accountId}/${recipeId}/categories/${eventCategoryId}`]: null });
  }

  return admin.database().ref().update(updates);
});

export const generateGroceryList = functions.database.ref('/groceryLists/{account_id}/{list_id}').onCreate(async event => {
  const accountId = getParam(event, 'account_id');
  const listId = getParam(event, 'list_id');
  const { startDate, endDate } = event.data.val();

  const scheduledRecipes = await admin.database().ref(`/scheduledRecipes/${accountId}`).orderByChild('scheduledDate').startAt(startDate).endAt(endDate).once('value').then(res => res.val()) || [];
  const recipeIds: string[] = Object.keys(scheduledRecipes).map(scheduledId => scheduledRecipes[scheduledId].recipeId);

  const recipes: Recipe[] = await Promise.all(recipeIds.map(id => admin.database().ref(`/recipes/${accountId}`).child(id).once('value').then(res => res.val())));
  const { ingredients, ingredientText } = recipes.reduce((acc, recipe) => {
    if (recipe.ingredients) {
      for (const ingredientId of Object.keys(recipe.ingredients)) {
        acc.ingredients.push(recipe.ingredients[ingredientId]);
      }
      acc.ingredientText = acc.ingredientText + recipe.ingredientText + '\n';
    }
    return acc;
  }, { ingredients: [] as Ingredient[], ingredientText: '' });

  const combinedIngredients = combine(ingredients);

  const updates = { ingredients: {}, ingredientText: '' };
  updates.ingredients = combinedIngredients.reduce((acc: object, ingredient: object) => {
    const key = admin.database().ref().push().key as string;
    return Object.assign(acc, { [key]: ingredient });
  }, {});
  updates.ingredientText = ingredientText;
  return admin.database().ref(`groceryLists/${accountId}/${listId}`).update(updates);
});

export const handleInvitations = functions.database.ref('/queues/invitations/{task_id}').onCreate(async event => {
  const taskId = getParam(event, 'task_id');
  const { didAccept, inviteId, notificationId, userId } = event.data.val();

  const updates: { [key: string]: any } = {
    [`queues/invitations/${taskId}`]: null,
    [`users/${userId}/notifications/${notificationId}`]: null,
    [`invites/${inviteId}`]: null
  };

  if (didAccept) {
    const invite = await admin.database().ref(`/invites/${inviteId}`).once('value').then(res => res.val()) || null;
    if (invite) {
      const { accountId, invitedBy } = invite;
      const account = await admin.database().ref(`/accounts/${accountId}`).once('value').then(res => res.val()) || null;
      if (account) {
        const oldAccountId = await admin.database().ref(`/users/${userId}/accountId`).once('value').then(res => res.val()) || '';
        updates[`accounts/${accountId}/users`] = { ...account.users, [userId]: true };
        updates[`accounts/${oldAccountId}`] = null;
        updates[`users/${userId}/accountId`] = accountId;
      } else {
        const newNotificationId = admin.database().ref().push().key as string;
        updates[`users/${userId}/notifications/${newNotificationId}`] = {
          message: 'Failed to join account: Account no longer exists',
          messageType: 'snackbar',
          status: 'error'
        };
      }
    } else {
      const newNotificationId = admin.database().ref().push().key as string;
      updates[`users/${userId}/notifications/${newNotificationId}`] = {
        message: 'Failed to join account: Invitation no longer exists',
        messageType: 'snackbar',
        status: 'error'
      };
    }
  }

  return admin.database().ref().update(updates);
});

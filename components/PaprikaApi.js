import axios from 'axios';
import includes from 'lodash/includes';
import now from 'lodash/now';

export class PapApi {
  constructor (auth) {
    this.api = axios.create({
      baseURL: 'https://www.paprikaapp.com/api/v1/sync/',
      auth: auth
    });
  }

  async doApiCall (target) {
    try {
      const res = await this.api.get(target);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateRecipes (current) {
    const recipeList = (await this.doApiCall('recipes/')).result;
    let currentRecipes = current;

    let needsUpdate = [];
    if (currentRecipes !== null) {
      const cachedHashes = Object.keys(currentRecipes).map((key) => {
        return currentRecipes[key].hash;
      });

      needsUpdate = recipeList.reduce((result, item) => {
        if (!includes(cachedHashes, item.hash)) {
          result.push(item.uid);
        }
        return result;
      }, []);
    } else {
      needsUpdate = recipeList.reduce((result, item) => {
        result.push(item.uid);
        return result;
      }, []);
      currentRecipes = {};
    }

    const recipePromises = needsUpdate.map((uid) => {
      return this.getRecipe(uid);
    });

    const recipeResponses = await Promise.all(recipePromises);

    currentRecipes = recipeResponses.reduce((cur, response) => {
      let recipe = response.result;
      recipe.ingredients = recipe.ingredients.split('\n');
      cur[recipe.uid] = recipe;
      return cur;
    }, currentRecipes);

    return currentRecipes;
  }

  async getRecipe (recipeID) {
    return this.doApiCall('recipe/' + recipeID + '/');
  }

  async getMeals () {
    const meals = (await this.doApiCall('meals/')).result;
    return meals.reduce((result, meal) => {
      const splittedDateStr = meal.date.split(' ')[0].split('-');
      const mealDate = new Date();
      mealDate.setFullYear(parseInt(splittedDateStr[0]), parseInt(splittedDateStr[1]) - 1, parseInt(splittedDateStr[2]));
      mealDate.setHours(0, 0, 0, 0);
      const inDays = Math.round((mealDate - now()) / (1000 * 60 * 60 * 24));
      if (inDays >= 0) {
        if (meal.recipe_uid) result.push(meal.recipe_uid);
      }
      return result;
    }, []);
  }

  async checkAuth () {
    return this.doApiCall('status/');
  }
}

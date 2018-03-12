import React, {Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setNeededIngredients, setCurrentIgredients, removeIngredient, setRecipes} from '../store/store';
import {PapApi} from './PaprikaApi';

import {View} from 'react-native'

import SwipeList from './SwipeList';
import WunderlistApi from './WunderlistApi';

class paprikaView extends Component {
  constructor () {
    super();
    this.handleListSelection = (action, target) => {
      this.handleSelection(action, target);
    };
  }

  componentDidMount () {
    this.api = new PapApi(this.props.authString);
    this.initializeList();
    this.wapi = new WunderlistApi(this.props.apiToken, this.props.apiClientID).wapi;
  }

  async initializeList () {
    if (this.props.initialState) {
      await this.syncRecipes();
      await this.updateNeeded();
      this.props.setCurrent(this.props.needed);
    }
  }

  async resetList () {
    await this.syncRecipes();
    await this.updateNeeded();
    this.props.setCurrent(this.props.needed);
    return true;
  }

  async syncRecipes () {
    try {
      const recipes = await this.api.updateRecipes(this.props.recipes);
      this.props.setRecipes(recipes);
    } catch (error) {
      console.error(error);
    }
  }

  async updateNeeded () {
    const recipes = this.props.recipes;
    const upcomingMeals = await this.api.getMeals();
    const neededIngredients = upcomingMeals.reduce((cur, uid) => {
      const recipe = recipes[uid];
      cur[uid] = {
        name: recipe.name,
        scale: recipe.servings,
        ingredients: recipe.ingredients
      };
      return cur;
    }, {});
    this.props.setNeeded(neededIngredients);
  }

  handleResetButton = async () => {
    await this.resetList();
  };

  handleListAccept = (index, uid) => {
    let title = this.props.current[uid].ingredients[index];
    this.wapi.post('tasks', {
      list_id: this.props.targetList,
      title: title
    });
    this.props.remove(uid, index);
  };

  handleListDeny = (index, uid) => {
    this.props.remove(uid, index);
  };

  renderLists () {
    const needed = this.props.current;
    if (!needed) {
      return;
    }
    return (
        Object.keys(needed).map((key) => {
          const recipe = needed[key];
          const ingredients = recipe.ingredients.map((ingr, index) => ({title: ingr, id: index}));
          return (
            <SwipeList
              title={`${needed[key].name} (${needed[key].scale})`}
              items={ingredients}
              key={key}
              acceptAction={(target) => this.handleListAccept(target, key)}
              denyAction={(target) => this.handleListDeny(target, key)}
              setSwipe={(val) => this.props.setSwipe(val)}
            />
          );
        })
    );
  }

  render () {
    return (
      <View>
        {this.renderLists()}
      </View>
    );
  }
}

const mapStateToProps = ({wApi, settings, papStore}) => ({
  authString: papStore.authString,
  needed: papStore.neededIngredients,
  current: papStore.currentIngredients,
  initialState: papStore.initial,
  recipes: papStore.recipes,
  apiToken: wApi.token,
  apiClientID: wApi.clientID,
  targetList: settings.target
});

const mapDispatchToProps = (dispatch) => {
  return {
    setNeeded: bindActionCreators(setNeededIngredients, dispatch),
    setCurrent: bindActionCreators(setCurrentIgredients, dispatch),
    remove: bindActionCreators(removeIngredient, dispatch),
    setRecipes: bindActionCreators(setRecipes, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(paprikaView);

import React, {Component} from 'react';

import {connect} from 'react-redux';
import {setItems, setTemplateItems, removeItem} from '../store/store';
import {bindActionCreators} from 'redux';

import WunderlistApi from './WunderlistApi';

import SwipeList from "./SwipeList";

class wunderListView extends Component {
  wapi = null;

  componentDidMount() {
    this.wapi = new WunderlistApi(this.props.apiToken, this.props.apiClientID).wapi;
    this.initializeList()
  }

  async initializeList() {
    if (this.props.templateList) {
      await this.reloadList();
      if (!this.props.listInitialized) {
        this.props.setItems(this.props.templateItems);
      }
    }
  }

  handleResetButton = async () => {
    if (this.props.templateList) {
      await this.reloadList();
      this.props.setItems(this.props.templateItems);
    }
  };

  handleListAccept = (target) => {
    this.wapi.post('tasks', {
      list_id: this.props.targetList,
      title: this.props.listItems[target].title,
    });
    this.props.removeItem(target);
  };

  handleListDeny = (target) => {
    this.props.removeItem(target);
  };

  async reloadList() {
    if (this.props.templateList) {
      try {
        const res = await this.wapi.get('tasks',
          {params: {list_id: this.props.templateList}});
        this.props.setTemplateItems(res.data);
      } catch (error) {
        console.error(error);
      }
    }
  }

  render() {
    return (
      <SwipeList
        title={'Template'}
        items={this.props.listItems}
        acceptAction={(target) => this.handleListAccept(target)}
        denyAction={(target) =>this.handleListDeny(target)}
        setSwipe={(val) => this.props.setSwipe(val)}
      />
    )
  }
}

const mapStateToProps = ({wApi, settings, wData, localList}) => ({
  apiToken: wApi.token,
  apiClientID: wApi.clientID,
  targetList: settings.target,
  templateList: settings.template,
  templateItems: wData.templateListItems,
  listItems: localList.items,
  listInitialized: !localList.initial,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setTemplateItems: bindActionCreators(setTemplateItems, dispatch),
    setItems: bindActionCreators(setItems, dispatch),
    removeItem: bindActionCreators(removeItem, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(wunderListView);

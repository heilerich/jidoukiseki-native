import React from 'react';

import {Text, StyleSheet, View, FlatList} from 'react-native';
import {Icon, Separator} from 'native-base';
import Swipeable from 'react-native-swipeable';

class SwipeListItem extends React.Component {
  leftContent = (
    <View style={styles.leftSwipeItem}>
      <Icon style={styles.leftIcon} name='ios-checkmark' />
    </View>
  );
  rightContent = (
    <View style={styles.rightSwipeItem}>
      <Icon style={styles.rightIcon} name='ios-close' />
    </View>
  );

  render () {
    return (
      <Swipeable
        onLeftActionRelease={this.props.leftAction}
        onRightActionRelease={this.props.rightAction}
        leftContent={this.leftContent}
        rightContent={this.rightContent}
        onSwipeStart={this.props.onSwipeStart}
        onSwipeRelease={this.props.onSwipeRelease}
      >
        <View style={styles.listItem}>
          {this.props.children}
        </View>
      </Swipeable>
    )
  }
}

export default class SwipeList extends React.Component {
  constructor () {
    super();
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  render () {
    return (
      <FlatList
        ListHeaderComponent={(
          <Separator>
            <Text>{this.props.title}</Text>
          </Separator>
        )}
        ItemSeparatorComponent={this.renderSeparator}
        scrollEnabled={false}
        data={this.props.items}
        keyExtractor={(item) => item.id}
        renderItem={({item, index}) => {
          return (
            <SwipeListItem
              leftAction={() => this.props.acceptAction(index)}
              rightAction={() => this.props.denyAction(index)}
              onSwipeStart={() => this.props.setSwipe(true)}
              onSwipeRelease={() => this.props.setSwipe(false)}
            >
              <Text style={styles.itemText}>{item.title}</Text>
            </SwipeListItem>
          )
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  itemText: {
    fontSize: 15,
    paddingLeft: 10
  },
  listItem: {
    height: 50,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 0,
  },
  leftIcon: {
    fontSize: 45,
  },
  rightIcon: {
    fontSize: 45,
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
    backgroundColor: 'rgb(0, 144, 34)'
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
    backgroundColor: 'rgb(178, 9, 41)'
  },
});

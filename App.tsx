import React, { Component } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { CustomAppState } from "./redux/reducers";
import { UPDATE_SCORE, CHANGE_LEVEL, REFRESH_AGAIN } from "./redux/action";
import { Box, BoxStructure, BoxState } from "./components/box";

const shuffle = (a: BoxStructure[]) => {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateScore: (score: number) =>
    dispatch({ type: UPDATE_SCORE, payload: { score: score } }),
  nextLevel: () => dispatch({ type: CHANGE_LEVEL }),
  refresh: () => dispatch({ type: REFRESH_AGAIN })
});

const mapStateToProps = (state: CustomAppState) => ({
  level: state.level,
  score: state.score,
  isWrong: state.isRefreshed
});

interface OwnProps {
  level: number;
  score: number;
  isWrong: boolean | false;
}

interface DispatchProps {
  updateScore: (score: number) => void;
  nextLevel: () => void;
  refresh: () => void;
}

interface OwnState {
  leftHalfDataSource: BoxStructure[];
  rightHalfDataSource: BoxStructure[];
  boxLimit: number | 2;
  leftSelected: BoxStructure[];
  rightSelected: BoxStructure[];
}

type Props = OwnProps & OwnState & DispatchProps;

class App extends Component<Props, OwnState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      leftSelected: [],
      rightSelected: [],
      leftHalfDataSource: [],
      rightHalfDataSource: [],
      boxLimit: 2
    };
  }

  checkIsPresent = (box: BoxStructure) => {
    const selectedItems = this.state.leftSelected.concat(this.state.rightSelected);
    return selectedItems.length === 0
      || selectedItems.length % 2 !== 0 &&
      selectedItems.filter(i => i.data === box.data).length > -1;
  }

  checkAllBoxesOpen = () => {
    let count = this.state.leftHalfDataSource.filter(i => i.state === BoxState.OPEN).length;
    count = this.state.rightHalfDataSource.filter(i => i.state === BoxState.OPEN).length;
    return count === this.state.leftHalfDataSource.length + this.state.rightHalfDataSource.length;
  }

  onBoxClick = (box: BoxStructure, side: string) => {
    if (box.state === BoxState.OPEN) return;
    if (this.state.boxLimit == 0 || !this.checkIsPresent(box)) {
      this.setState({ boxLimit: 2 });
      this.props.refresh();
      return;
    }
    if (side == 'left') {
      let tempLeft = this.state.leftHalfDataSource.map(i => {
        if (i.data === box.data) i.state = BoxState.OPEN;
        return i;
      });
      this.setState({ leftHalfDataSource: tempLeft, leftSelected: this.state.leftSelected.concat(box), boxLimit: this.state.boxLimit - 1 });
    } else if (side == 'right') {
      let tempRight = this.state.rightHalfDataSource.map(i => {
        if (i.data === box.data) i.state = BoxState.OPEN;
        return i;
      });
      this.setState({ rightHalfDataSource: tempRight, rightSelected: this.state.rightSelected.concat(box), boxLimit: this.state.boxLimit - 1 });
    }
  };

  buildArray = (level: number) => {
    if (this.state.leftHalfDataSource && this.state.leftHalfDataSource.length > 0 && 
      this.state.rightHalfDataSource && this.state.rightHalfDataSource.length > 0) {
        
    } else {
      let leftSideArray: BoxStructure[] = [];
      let rightSideArray: BoxStructure[] = [];
      for (let i = 1; i < level + 2; i++) {
        leftSideArray.push({
          data: i,
          state: this.state.leftSelected.filter(j => j.data === i).length > 0 ? BoxState.OPEN : BoxState.CLOSED
        });
        rightSideArray.push({
          data: i,
          state: this.state.rightSelected.filter(j => j.data === i).length > 0 ? BoxState.OPEN : BoxState.CLOSED
        })
      }
      leftSideArray = shuffle(leftSideArray);
      rightSideArray = shuffle(rightSideArray);

      this.setState({
        leftHalfDataSource: leftSideArray,
        rightHalfDataSource: rightSideArray
      })
    }
  };

  componentWillMount() {
    this.buildArray(this.props.level);
  }

  componentWillUpdate() {
    if (this.checkAllBoxesOpen()) {
      this.props.updateScore(10);
      this.props.nextLevel();
      this.setState({ leftSelected: [], rightSelected: [] });
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (this.props.isWrong !== newProps.isWrong) {
      this.buildArray(newProps.level);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.levelContainer}>
          <Text style={styles.level}>Level {this.props.level}</Text>
          <Text style={styles.level}>Score {this.props.score}</Text>
        </View>
        <View style={styles.playArea}>
          <View style={styles.leftSide}>
            {this.state.leftHalfDataSource &&
              this.state.leftHalfDataSource.map((i: BoxStructure) => {
                return <Box
                  onClick={(box: BoxStructure) => this.onBoxClick(box, 'left')}
                  data={i.data}
                  boxState={i.state}
                />
              })}
          </View>
          <View style={styles.rightSide}>
            {this.state.rightHalfDataSource &&
              this.state.rightHalfDataSource.map((i: BoxStructure) => {
                return <Box
                  onClick={(box: BoxStructure) => this.onBoxClick(box, 'right')}
                  data={i.data}
                  boxState={i.state}
                />
              })}
          </View>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  level: {
    fontSize: 20,
    color: "#000000",
    padding: 5,
    flex: 1
  },
  playArea: {
    display: "flex",
    flexDirection: "row",
    flex: 1
  },
  leftSide: {
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
  rightSide: {
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
  levelContainer: {
    display: 'flex',
    flexDirection: 'row'
  }
});

import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

export enum BoxState {
    OPEN,
    CLOSED
}

export interface BoxStructure {
    data: number;
    state: BoxState | BoxState.CLOSED;
}

export const Box = ({
    onClick,
    boxState,
    data
}: {
        onClick: (boxStructure: BoxStructure) => void;
        boxState: BoxState;
        data: number;
    }) => <View style={styles.container}>
            <TouchableOpacity onPress={() => onClick({ data: data, state: boxState })}>
            {boxState === BoxState.OPEN && <Text style={styles.open}>{data}</Text>}
            {boxState === BoxState.CLOSED && <Text style={styles.closed}></Text>}</TouchableOpacity>
        </View>;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#000000',
        flex: 1,
        margin: 10,
        height: 30
    },
    open: {
        fontSize: 15,
        color: '#000000'
    },
    closed: {
        backgroundColor: 'grey',
        width: 100,
        height: 100
    }
})

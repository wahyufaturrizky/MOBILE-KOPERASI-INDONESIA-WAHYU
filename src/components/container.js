import React, { useState } from 'react';
import {
    View
} from 'react-native';

export const Space = (props) => {

    const height = props.size

    return (
        <View style={{
            height: height
        }} />
    );
};
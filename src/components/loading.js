import React, { useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {
    View
} from 'react-native';
import { Colors } from '../styles/colors';

export const LoadingOverlay = (props) => {

    const active = props.loading

    return (
        <Spinner
          visible={active}
          color={Colors.secondary}
          animation={'fade'}
          overlayColor={'rgba(0, 0, 0, 0.5)'}
        />
    );
};
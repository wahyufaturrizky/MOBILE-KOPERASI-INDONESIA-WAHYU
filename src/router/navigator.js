import { Navigation } from 'react-native-navigation';
import { Colors } from '../styles/colors';
import Ionicon from 'react-native-vector-icons/Ionicons';

import icon from '../assets/images/logo.png'
import { getStorage } from '../config/storage';

export const Nav = async (data) => {
    try {

        const { title, page, param, ID, header } = data;

        Navigation.push(ID, {
            component: {
                name: page,
                passProps: param,
                options: {
                    topBar: {
                        visible: title !== null && title !== 'Term And Condition' && header !== false,
                        animate: true,
                        background: {
                            color: Colors.primary
                        },
                        title: {
                            text: title,
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: Colors.light
                        },
                        backButton: {
                            color: Colors.light
                        }
                    },
                    animations: {
                        pop: {
                            enabled: true
                        },
                        push: {
                            enabled: true
                        }
                    }
                },
            }
        });

    } catch (error) {
        console.log(error)
    }
}

export const setRoot = async (data) => {

    try {

        const { title, page, param, ID } = data;

        Navigation.setRoot({
            root: {
                stack: {
                    children: [
                        {
                            component: {
                                name: page,
                            },
                        },
                    ],
                    options: {
                        topBar: {
                            visible: title !== null && title !== 'Login',
                            animate: true,
                            background: {
                                color: Colors.primary
                            },
                            title: {
                                text: title,
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: Colors.light
                            },
                        },
                        animations: {
                            pop: {
                                enabled: false
                            },
                            push: {
                                enabled: false
                            }
                        }
                    }
                }
            },
        });

    } catch (error) {
        console.log(error)
    }
}

export const setRootTabs = async (data) => {
    try {
        const { ID } = data;
        const homeIcon = await Ionicon.getImageSource('ios-home', 50, Colors.light);
        const contactIcon = await Ionicon.getImageSource('ios-contact', 50, Colors.light);
        const walletIcon = await Ionicon.getImageSource('ios-basket', 50, Colors.light);
        const cartIcon = await Ionicon.getImageSource('ios-list-box', 50, Colors.light);
        const transaction = await Ionicon.getImageSource('ios-clipboard', 50, Colors.light);

        Navigation.setRoot({
            root: {
                stack: {
                    children: [
                        {
                            bottomTabs: {
                                children: [
                                    {
                                        component: {
                                            name: 'ark.Home',
                                            options: {
                                                bottomTab: {
                                                    text: 'Home',
                                                    icon: homeIcon,
                                                    selectedIconColor: Colors.light,
                                                    fontWeight: 'bold',
                                                },
                                            }
                                        },
                                    },
                                    {
                                        component: {
                                            name: 'ark.Product',
                                            options: {
                                                bottomTab: {
                                                    text: 'Product',
                                                    icon: cartIcon,
                                                    textColor: Colors.light,
                                                    selectedIconColor: Colors.light,
                                                },
                                            }
                                        },
                                    },
                                    {
                                        component: {
                                            name: 'ark.Cart',
                                            options: {
                                                bottomTab: {
                                                    text: 'Cart',
                                                    icon: walletIcon,
                                                    textColor: Colors.light,
                                                    selectedIconColor: Colors.light,
                                                },
                                            }
                                        },
                                    },
                                    {
                                        component: {
                                            name: 'ark.Order',
                                            options: {
                                                bottomTab: {
                                                    text: 'Transactions',
                                                    icon: transaction,
                                                    textColor: Colors.light,
                                                    selectedIconColor: Colors.light,
                                                },
                                            }
                                        },
                                    },
                                    {
                                        component: {
                                            name: 'ark.Profile',
                                            options: {
                                                bottomTab: {
                                                    text: 'Personal',
                                                    icon: contactIcon,
                                                    textColor: Colors.light,
                                                    selectedIconColor: Colors.light,
                                                },
                                            }
                                        },
                                    },
                                ],
                                options: {
                                    bottomTabs: {
                                        backgroundColor: Colors.primary,
                                        animate: true,
                                        currentTabIndex: 0,
                                        drawBehind: false,
                                    },
                                }
                            }
                        }
                    ],
                    options: {
                        topBar: {
                            visible: false,
                            animate: true,
                        },
                    }
                }
            },
        });
    } catch (error) {
        console.log(error)
    }
}

export const popToSettings = async () => {
    let ID = await getStorage('idSettings');
    Navigation.popTo(ID)
}
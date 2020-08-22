/* eslint-disable */
import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, } from 'react-native';
import {createStackNavigator} from "react-navigation"
import {YellowBox, 
    KeyboardAvoidingView,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback,
    Platform,
    ImageBackground,
} from 'react-native';
// import { SkypeIndicator } from 'react-native-indicators';


import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE, Marker} from 'react-native-maps'; 

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var top_inset = Platform.OS == "ios" ? StaticSafeAreaInsets.safeAreaInsetsTop : 0;
var bottom_inset = Platform.OS == "ios" ? StaticSafeAreaInsets.safeAreaInsetsBottom : 30;
var safearea_height = deviceHeight - top_inset - bottom_inset;
YellowBox.ignoreWarnings(["Warning:"]);
YellowBox.ignoreWarnings(["`-[RCTRootView cancelTouches]`"]);

export default class MapScreen extends Component {
    static navigationOptions = {
        header: null,
        headerBackTitle: null
	};

	constructor(props){
		super();

		this.state = {
		  isVisible : true,
          isReady: false,
          
          selected_data: props.navigation.state.params.selected_data
		}
    }
    
    async UNSAFE_componentWillMount() {
    }

    render() {
        return (
            <View style={styles.container}>
            {
                this.state.showIndicator &&
                <View style = {{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', opacity: 0.3, zIndex: 100}}>
                    <View style = {{flex: 1}}>
                        <SkypeIndicator color = '#ffffff' />
                    </View>
                </View>
            }
                <View style = {styles.safe_area}>
                    <View style = {styles.input_area}>
                        <View style = {{width: '100%', height: '100%'}}>
                            <View style = {{width: '100%', height: '40%', alignItems: 'center', flexDirection: 'row'}}>
                                <Text style = {{fontSize: 16, color: '#000000'}}>Departure Time: </Text>
                                <Text style = {{fontSize: 16, color: '#000000'}}>{this.state.selected_data.DepartureTime_display}</Text>
                            </View>
                            <View style = {{width: '100%', height: '30%', alignItems: 'center', flexDirection: 'row'}}>
                                <Text style = {{fontSize: 16, color: '#000000'}}>mode: </Text>
                                <Text style = {{fontSize: 16, color: '#000000'}}>{this.state.selected_data.mode == 0 ? "bus" : "train"}</Text>
                            </View>
                            <View style = {{width: '100%', height: '30%', justifyContent: 'center', flexDirection: 'row'}}>
                                <View style = {{width: '50%', height: '100%', alignItems: 'center', flexDirection: 'row'}}>
                                    <Text style = {{fontSize: 16, color: '#000000'}}>lat: </Text>
                                    <Text style = {{fontSize: 16, color: '#000000'}}>{this.state.selected_data.Location.lat}</Text>
                                </View>
                                <View style = {{width: '50%', height: '100%', alignItems: 'center', flexDirection: 'row'}}>
                                    <Text style = {{fontSize: 16, color: '#000000'}}>lng: </Text>
                                    <Text style = {{fontSize: 16, color: '#000000'}}>{this.state.selected_data.Location.long}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style = {{width: '100%', height: safearea_height - 150}}>
                        <MapView
                            // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                            style={{width: '100%', height: '100%'}}
                            region={{
                                latitude: this.state.selected_data.Location.lat,
                                longitude: this.state.selected_data.Location.long,
                                latitudeDelta: 0.015,
                                longitudeDelta: 0.0121,
                            }}
                            >
                            <Marker coordinate = {{latitude: this.state.selected_data.Location.lat, longitude: this.state.selected_data.Location.long}}/>
                        </MapView>
                    </View>
                    <TouchableOpacity style = {styles.back_button_view} onPress = {() => this.props.navigation.navigate("HomeScreen")}>
                        <Text style = {{fontSize: 20, color: '#000000'}}>Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    safe_area: {
        width: '100%',
        height: safearea_height,
        alignItems: 'center',
        marginTop: top_inset,
        marginBottom: bottom_inset,
    },
    input_area: {
        width: '90%',
        height: 100,
        // alignItems: 'center',
        
    },


    back_button_view: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000000',
        borderWidth: 1
    }
});
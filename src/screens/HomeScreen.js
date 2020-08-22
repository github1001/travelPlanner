
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
import { SkypeIndicator } from 'react-native-indicators';
import SafeAreaView from 'react-native-safe-area-view';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var top_inset = Platform.OS == "ios" ? StaticSafeAreaInsets.safeAreaInsetsTop : 0;
var bottom_inset = Platform.OS == "ios" ? StaticSafeAreaInsets.safeAreaInsetsBottom : 30;
var safearea_height = deviceHeight - top_inset - bottom_inset;
YellowBox.ignoreWarnings(["Warning:"]);


export default class HomeScreen extends Component {
    static navigationOptions = {
        header: null,
        headerBackTitle: null
	};

	constructor(props){
		super();

		this.state = {
            showIndicator: false,
            min_time: '',
            min_time_display: '',
            max_time: '',
            max_time_display: '',
            isDateTimePickerVisible: false,
            selected_date_string: '',

            selected_bustype: 0,
            bus_type_show: false,

            data_list: [],
            selected_bus_data_list: []
		}
    }
    
    async UNSAFE_componentWillMount() {
        
    }

    showDateTimePicker = (type) => {
        this.setState({ 
            isDateTimePickerVisible: true,
            selected_button: type
        });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        // console.warn("A date has been picked: ", date);
        this.setState({
            selected_date: date
        });
        this.setState({
            selected_date_string: moment(date).format("YYYY-MM-DD HH:mm:ss"),
        })
        if(this.state.selected_button == "min") {
            this.setState({
                min_time: moment(date).format(),
                min_time_display: moment(date).format("YYYY-MM-DD HH:mm:ss"),
            })
        } else if(this.state.selected_button == "max") {
            this.setState({
                max_time: moment(date).format(),
                max_time_display: moment(date).format("YYYY-MM-DD HH:mm:ss"),
            })
        }
        this.hideDateTimePicker();
    };

    selection_bustype = (bus_type) => {
        this.setState({
            selected_bustype: bus_type,
            bus_type_show: false
        });
        var selected_bus_data_list = [];
        var data_list = this.state.data_list;
        for(i = 0; i < data_list.length; i ++) {
            if(data_list[i].mode == bus_type) {
                if(moment(data_list[i].DepartureTime).isBefore(moment(this.state.max_time)) && moment(data_list[i].DepartureTime).isAfter(new Date(this.state.min_time))) {
                    selected_bus_data_list.push(data_list[i]);
                }
            }
        }
        
        this.setState({
            selected_bus_data_list: selected_bus_data_list
        })
    }

    get_data = async() => {
        if(this.state.min_time == '' || this.state.max_time == '') {
            Alert.alert("Warning!", "Please input Min and Max Depature time.");
            return;
        }
        this.setState({showIndicator: true});
        await fetch('https://pastebin.com/raw/d9wNLA4k')
        .then(response => response.json())
        .then(async data => {
            // var data_list = [];
            for(i = 0; i < data.length; i ++) {
                data[i].DepartureTime_display = moment(data[i].DepartureTime).format("YYYY-MM-DD HH:mm:ss");
            }
            this.setState({
                data_list: data
            })
            var selected_bus_data_list = [];
            for(i = 0; i < data.length; i ++) {
                if(data[i].mode == this.state.selected_bustype) {
                    if(moment(data[i].DepartureTime).isBefore(moment(this.state.max_time)) && moment(data[i].DepartureTime).isAfter(new Date(this.state.min_time))) {
                        selected_bus_data_list.push(data[i]);
                    }
                }
            }
            this.setState({
                selected_bus_data_list: selected_bus_data_list
            })
        })
        .catch(function(error) {
            Alert.alert('Warning!', error.message);
        });
        
        this.setState({showIndicator: false});

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
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                            mode = {'datetime'}
                            date = {this.state.selected_date_string == "" ? new Date() : this.state.selected_date}
                        />
                        <View style = {styles.component_view}>
                            <Text style = {{fontSize: 16, color: '#808080'}}>Departure Min</Text>
                            <TouchableOpacity style = {styles.time_button} onPress = {() => this.showDateTimePicker("min")}>
                                <Text style = {{fontSize: 16, color: '#000000'}}>{this.state.min_time_display}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {styles.component_view}>
                            <Text style = {{fontSize: 16, color: '#808080'}}>Departure Max</Text>
                            <TouchableOpacity style = {styles.time_button} onPress = {() => this.showDateTimePicker("max")}>
                                <Text style = {{fontSize: 16, color: '#000000'}}>{this.state.max_time_display}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style = {{width: '90%', height: safearea_height - 160}}>
                        <View style = {{width: '100%', height: 30, flexDirection: 'row'}}>
                            <View style = {{width: '50%', height: '100%', justifyContent: 'center'}}>
                                <View style = {{width: 100, height: '100%'}}>
                                    <TouchableOpacity style = {styles.bus_type_button} onPress = {() => this.setState({bus_type_show: !this.state.bus_type_show})}>
                                        <View style = {{width: '60%', height: '100%', justifyContent: 'center', paddingLeft: 5}}>
                                            <Text style = {{fontSize: 16, color: '#000000'}}>{this.state.selected_bustype == 0 ? "bus" : "train"}</Text>
                                        </View>
                                        <View style = {{width: '40%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                            <Image style = {{width: 20, height: 200}} resizeMode = {'contain'} source={require('../assets/dropdown.png')}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style = {{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'flex-end'}}>
                                <TouchableOpacity style = {{width: 80, height: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#000000'}} onPress = {() => this.get_data()}>
                                    <Text style = {{fontSize: 16, color: '#000000'}}>Enter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    {
                        this.state.bus_type_show &&
                        <View style = {{width: 100, height: 60, position: 'absolute', top: 30, left: 0, backgroundColor: '#ffffff', zIndex: 20}}>
                            <TouchableOpacity style = {{width: '100%', height: '50%', justifyContent: 'center', paddingLeft: 5}} onPress = {() => this.selection_bustype(0)}>
                                <Text style = {{fontSize: 16, color: '#000000'}}>bus</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {{width: '100%', height: '50%', justifyContent: 'center', paddingLeft: 5}} onPress = {() => this.selection_bustype(1)}>
                                <Text style = {{fontSize: 16, color: '#000000'}}>train</Text>
                            </TouchableOpacity>
                        </View>
                    }
                        <ScrollView style = {{width: '100%'}}>
                        {
                            this.state.selected_bus_data_list.map((item, index) =>
                            <TouchableOpacity key = {index} style = {styles.data_list_component} onPress = {() => this.props.navigation.navigate("MapScreen", {selected_data: item})}>
                                <View style = {{width: '100%', height: '100%'}}>
                                    <View style = {{width: '100%', height: '40%', alignItems: 'center', flexDirection: 'row'}}>
                                        <Text style = {{fontSize: 16, color: '#000000'}}>Departure Time: </Text>
                                        <Text style = {{fontSize: 16, color: '#000000'}}>{item.DepartureTime_display}</Text>
                                    </View>
                                    <View style = {{width: '100%', height: '30%', alignItems: 'center', flexDirection: 'row'}}>
                                        <Text style = {{fontSize: 16, color: '#000000'}}>mode: </Text>
                                        <Text style = {{fontSize: 16, color: '#000000'}}>{item.mode == 0 ? "bus" : "train"}</Text>
                                    </View>
                                    <View style = {{width: '100%', height: '30%', justifyContent: 'center', flexDirection: 'row'}}>
                                        <View style = {{width: '50%', height: '100%', alignItems: 'center', flexDirection: 'row'}}>
                                            <Text style = {{fontSize: 16, color: '#000000'}}>lat: </Text>
                                            <Text style = {{fontSize: 16, color: '#000000'}}>{item.Location.lat}</Text>
                                        </View>
                                        <View style = {{width: '50%', height: '100%', alignItems: 'center', flexDirection: 'row'}}>
                                            <Text style = {{fontSize: 16, color: '#000000'}}>lng: </Text>
                                            <Text style = {{fontSize: 16, color: '#000000'}}>{item.Location.long}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                        }
                        </ScrollView>
                    </View>
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
        height: 160,
        // alignItems: 'center',
        
    },
    component_view: {
        width: '100%',
        height: 80,
        justifyContent: 'space-around'
    },
    time_button: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        paddingLeft: 10,
        borderColor: '#000000',
        borderWidth: 1
    },
    bus_type_button: {
        width: 100,
        height: 30,
        borderColor: '#000000',
        borderWidth: 1,
        flexDirection: 'row',

    },
    data_list_component: {
        width: '100%',
        height: 100,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: '#c0c0c0',
        borderBottomWidth: 1
    }
});
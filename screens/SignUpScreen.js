import { TextInput  , StyleSheet, Image, View, ActivityIndicator } from 'react-native';
import * as React from 'react';
import { useEffect} from 'react';
import { Button} from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons'; 
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import { useFonts } from '@expo-google-fonts/inter';
import {auth, db} from '../firebase';
import * as ImagePicker from 'expo-image-picker';


export function SignUpScreen({ navigation }){
  const [avatar , setAvatar] = React.useState(null);
  const [gender , setGender] = React.useState("");
  const [name, setName] = React.useState("");
  const [email , setEmail] = React.useState("");
  const [password , setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [diabetes, setDiabetes] = React.useState("");



  useEffect(() => {
 
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert("monDiabète a besion d'utiliser votre caméra");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  };


  const signup = ({navigation}) => {

  
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
          authUser.user.updateProfile({
            displayName: name,
            photoURL: avatar || null ,
            
        });
        
        db.collection('users').doc(auth.currentUser.uid).set({
          fullName: name,
          email: email,
          GSM: phone,
          gender:gender,
          diabetesType: diabetes,
        });
        
        navigation.navigate('SignUpPage2');
        
     })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        alert('E-mail déjà utilisé');
      }
  
      if (error.code === 'auth/invalid-email') {
        alert('E-mail invalide');
      }

    
    

    });
  };



  let [fontsLoaded] = useFonts({
      'Nexa-Bold': require('../assets/fonts/Nexa-Bold.otf'),
      'Nexa-Light': require('../assets/fonts/Nexa-Light.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
    
    return (
      <ScrollView contentContainerStyle={styles.container}>

          <View style={{height:30}}></View>
             <TouchableOpacity style={styles.avatarPlaceholder} onPress={pickImage}>
               <Ionicons name="ios-add" size={40} color="white" />
             <Image source={{ uri: avatar }} style={styles.avatar} />
             </TouchableOpacity>
          <View style={[styles.inputView , {marginTop:30}]} >
          
            <View style={styles.selectGender}>
              <RNPickerSelect 
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              placeholder={{
                label: 'genre',
                value: null,
                color:'grey'
              }}
              value={gender}
              onValueChange={(value) => setGender(value)}
                items={[
                    { label: 'Mr.', value: 'homme' },
                    { label: 'Mme.', value: 'femme' },
                ]}
              />
            
              <View style={styles.genderInputView } >
                <TextInput  
                style={styles.inputText}
                placeholder="nom complet "
                autoFocus
                type="text"
                value={name}
                onChangeText={(text) => setName(text)}
                placeholderTextColor="#057dcd"
                />
              </View>
            </View>
          </View>
          <View style={styles.inputView} >
          <TextInput  
          style={styles.inputText}
          placeholder="votre e-mail"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholderTextColor="#057dcd"
          />
          </View>

          <View style={styles.inputView} >
            <TextInput
          style={styles.inputText}
          placeholder="choisissez un mot de passe" 
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          placeholderTextColor="#057dcd"
          />
          </View>
          <View style={styles.inputView} >
          <TextInput  
          style={styles.inputText}
          placeholder="GSM ( optionel )"
          type="text"
          value={phone}
          onChangeText={(text) => setPhone(text)}
          placeholderTextColor="#057dcd"
          />
          </View>
          <View style={styles.inputView } >
          
            <View >
              <RNPickerSelect 
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              placeholder={{
                label: 'Type de diabètes',
                value: null,
                color:'grey'
              }}
              value={diabetes}
              onValueChange={(value) => setDiabetes(value)}
                items={[
                    { label: 'Type 1', value: 'type1' },
                    { label: 'Type 2', value: 'type2' },
                    { label: 'Diabète de grossesse', value: 'grossesse' },
                ]}
              />
            </View>
          </View>
          
          <Button title="S'inscrire" 
          containerStyle={[styles.Btn , {marginTop:30}]}
          titleStyle={{fontFamily:'Nexa-Bold'}} 
          onPress={signup}/>
          
        <Button  title="Retour" type='outline' 
        containerStyle={styles.Btn}
        titleStyle={{fontFamily:'Nexa-Bold' , color:"white"}}
        onPress={() => navigation.navigate('LogIn')} />
      </ScrollView>
  );
  }


  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: '#f8faff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarPlaceholder:{
      position:'relative',
      width:100,
      height:100,
      borderRadius:50,
      backgroundColor:'#bfe5fd',
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
    },
    avatar:{
      position:'absolute',
      width:100,
      height:100,
      borderRadius:50,
    },
    inputView:{
      width:"80%",
      backgroundColor:"white",
      borderRadius:10,
      height:50,
      marginBottom:10,
      justifyContent:"center",
      paddingLeft:20,
    },
    inputText:{
      height:50,
      color:"black",
      fontFamily:'Nexa-Light',
      fontSize:16
    },
    Btn:{
      width:"50%",
      marginBottom:15,
      backgroundColor:'#000c66'
    },
    selectGender:{
      width:'80%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    },
    genderInputView:{
      width:'100%',
      backgroundColor:"white",
      height:50,
      marginBottom:20,
      justifyContent:"center",
      paddingLeft:20,
    },

  });

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontFamily:'Nexa-Bold',
      fontSize:12,
      borderRadius: 8,
      color: '#145da0',
      justifyContent:'center',
      display:'flex',
      alignItems:'center',
      paddingRight: 30,
      height:50
    },
    inputAndroid: {
      fontFamily:'Nexa-Light',
      fontSize:16,
      borderRadius: 8,
      color: '#000c66',
      justifyContent:'center',
      display:'flex',
      alignItems:'center',
      paddingRight: 30,
      height:50
    },

  });
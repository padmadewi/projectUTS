import React, { Component } from 'react';
 
import { StyleSheet, View, Alert, TextInput, Button, Text, Platform, TouchableOpacity, ListView, ActivityIndicator, RefreshControl, Image } from 'react-native';
 
import { StackNavigator } from 'react-navigation';
 
class MainActivity extends Component {
 
  static navigationOptions =
  {
    title: 'Data Anggota HMJ',

  };
 
constructor(props) {
 
   super(props)
 
   this.state = {
 
     nim: '',
     nama: '',
     jabatan: '',
     nomor_telepon: '',
     email: '',
     ActivityIndicator_Loading: false, 
 
   }
 
 }

 Insert_Data_Into_MySQL = () =>{
      
      this.setState({ ActivityIndicator_Loading : true }, () =>
  {
      fetch('http://padmadewi.000webhostapp.com/B1615051073/InsertAnggotaData.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
 
        nim : this.state.nim,
 
        nama : this.state.nama,
 
        jabatan : this.state.jabatan,
 
        nomor_telepon: this.state.nomor_telepon,

        email: this.state.email
 
      })
 
      }).then((response) => response.json())
          .then((responseJsonFromServer) => {
            alert(responseJsonFromServer);
                this.setState({ ActivityIndicator_Loading : false });
 
          }).catch((error) => {
            console.error(error);

            this.setState({ ActivityIndicator_Loading : false});
          });
      });
}
 
 GoTo_Show_AnggotaList_Activity_Function = () =>
  {
    this.props.navigation.navigate('Second');
    
  }


 render() {
   return (
 
<View style={styles.MainContainer}>

  <Image
      source={require('./assets/users.png')}
      style={{width: 100, height: 100 }}
   />
 
       <Text style={{fontSize: 20, textAlign: 'center'}}> Registrasi Data Diri Anggota</Text>
 
       <TextInput
         
         placeholder="Masukkan NIM"
 
         onChangeText={(nim) => this.setState({ nim })}
 
        underlineColorAndroid='transparent'
 
         style={styles.TextInputStyleClass}
         
       />
 
      <TextInput
         
         placeholder="Masukkan Nama"
 
         onChangeText={(nama) => this.setState({ nama })}
 
         underlineColorAndroid='transparent'
 
         style={styles.TextInputStyleClass}
       />
 
      <TextInput
         
         placeholder="Masukkan Jabatan"
 
         onChangeText={(jabatan) => this.setState({ jabatan })}
 
         underlineColorAndroid='transparent'
 
         style={styles.TextInputStyleClass}
       />
 
       <TextInput
 
         placeholder="Nomor Telepon"
 
         onChangeText={(nomor_telepon) => this.setState({ nomor_telepon })}
 
         underlineColorAndroid='transparent'
 
         style={styles.TextInputStyleClass}
       />

       <TextInput
 
         placeholder="Email"
 
         onChangeText={(email) => this.setState({ email })}
 
         underlineColorAndroid='transparent'
 
         style={styles.TextInputStyleClass}
       />
 
      <TouchableOpacity 
          activeOpacity = { 0.4 } 
          style={styles.TouchableOpacityStyle} 
          onPress={this.Insert_Data_Into_MySQL} >
 
        <Text style={styles.TextStyle}> Input Data Anggota </Text>
 
      </TouchableOpacity>
 
      <TouchableOpacity activeOpacity = { 0.4 } 
          style={styles.TouchableOpacityStyle} 
          onPress={this.GoTo_Show_AnggotaList_Activity_Function} >
 
        <Text style={styles.TextStyle}> Lihat detail Anggota </Text>
 
      </TouchableOpacity>

      {
        
          this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#2196F3' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
          }
 
</View>
           
   );
 }
}
 
class ShowAnggotaListActivity extends Component {
 
  constructor(props) { 
 
    super(props);
 
    this.state = {
 
      isLoading: true,
      refreshing: false,
 
    }
  }
 
  static navigationOptions =
  {
     title: 'Daftar Nama Anggota',
  };
 
  componentDidMount() {
      this.setState({refreshing: true});
       return fetch('http://padmadewi.000webhostapp.com/B1615051073/ShowAllAnggotaList.php')
         .then((response) => response.json())
         .then((responseJson) => {
           let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
           this.setState({
             isLoading: false,
             refreshing: false,
             dataSource: ds.cloneWithRows(responseJson),
           }, function() {
             // In this block you can do something with new state.
           });
         })
         .catch((error) => {
           console.error(error);
         });
     }
    
     GethmjFunction=(nim, nama, jabatan, nomor_telepon, email)=>{
 
          this.props.navigation.navigate('Third', { 
 
            nim : nim,
            nama : nama,
            jabatan : jabatan,
            nomor_telepon : nomor_telepon,
            email : email
 
          });
 
     }
 
     ListViewItemSeparator = () => {
       return (
         <View
           style={{
             height: .5,
             width: "100%",
             backgroundColor: "black",
           }}
         />
       );
     }
 
     render() {
      if (this.state.isLoading) {
        return (
          <View style={{flex: 1, paddingTop: 20}}>
            <ActivityIndicator />
          </View>
        );
      }
   
      return (
   
        <View style={styles.MainContainer_For_Show_AnggotaList_Activity}>
   
          <ListView
   
            dataSource={this.state.dataSource}
   
            renderSeparator= {this.ListViewItemSeparator}
   
            renderRow={ (rowData) => <Text style={styles.rowViewContainer} 
 
                      onPress={this.GethmjFunction.bind(
                        this, rowData.nim,
                         rowData.nama, 
                         rowData.jabatan, 
                         rowData.nomor_telepon, 
                         rowData.email
                         )} > 
 
                      {rowData.nama} 
                      
                      </Text> }

           refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.componentDidMount.bind(this)}
          />
        }
   
          />
   
        </View>
      );
    }
 
}
 
class EditAnggotaRecordActivity extends Component {
  
  constructor(props) {
    
       super(props)
    
       this.state = {
    
         nim: '',
         nama: '',
         jabatan: '',
         nomor_telepon: '',
         email: '',
    
       }
    
     }
 
     componentDidMount(){
 
      // Received Student Details Sent From Previous Activity and Set Into State.
      this.setState({ 
        nim : this.props.navigation.state.params.nim,
        nama: this.props.navigation.state.params.nama,
        jabatan: this.props.navigation.state.params.jabatan,
        nomor_telepon: this.props.navigation.state.params.nomor_telepon,
        email: this.props.navigation.state.params.email,
      })
 
     }
  
    static navigationOptions =
    {
       title: 'Detail Data Diri Anggota',
    };
 
    UpdateAnggotaRecord = () =>{
      
            fetch('https://padmadewi.000webhostapp.com/B1615051073/UpdateAnggotaRecord.php', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
      
              nim : this.state.nim,
 
              nama : this.state.nama,
      
              jabatan : this.state.jabatan,
      
              nomor_telepon : this.state.nomor_telepon,
      
              email: this.state.email
      
            })
      
            }).then((response) => response.json())
                .then((responseJson) => {
      
                  // Showing response message coming from server updating records.
                  Alert.alert(responseJson);
      
                }).catch((error) => {
                  console.error(error);
                });
      
      }
 
 
    DeleteAnggotaRecord = () =>{
        
          fetch('https://padmadewi.000webhostapp.com/B1615051073/DeleteAnggotaRecord.php', {
          method: 'POST',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({
        
            nim : this.state.nim
        
          })
        
          }).then((response) => response.json())
          .then((responseJson) => {
        
            // Showing response message coming from server after inserting records.
            Alert.alert(responseJson);
        
          }).catch((error) => {
             console.error(error);
          });
 
          this.props.navigation.navigate('First');
 
      }
 
    render() {
 
      return (
   
   <View style={styles.MainContainer}>
   
          <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 7}}> Detail Data Diri Anggota </Text>
    
          <TextInput
            
            placeholder="Masukkan Nama"
            
            value={this.state.nama}
   
            onChangeText={(nama) => this.setState({ nama })}
   
            underlineColorAndroid='transparent'
   
            style={styles.TextInputStyleClass}
          />
   
         <TextInput
            
            placeholder="Masukkan Jabatan"
 
            value={this.state.jabatan}
   
            onChangeText={(jabatan) => this.setState({ jabatan })}
   
            underlineColorAndroid='transparent'
   
            style={styles.TextInputStyleClass}
          />
   
         <TextInput
            
            placeholder="Nomor Telepon"
 
            value={this.state.nomor_telepon}
   
            onChangeText={(nomor_telepon) => this.setState({ nomor_telepon })}
   
            underlineColorAndroid='transparent'
   
            style={styles.TextInputStyleClass}
          />
   
          <TextInput
   
            placeholder="email"
 
            value={this.state.email}
   
            onChangeText={(email) => this.setState({ email })}
   
            underlineColorAndroid='transparent'
   
            style={styles.TextInputStyleClass}
          />
   
         <TouchableOpacity activeOpacity = { .4 } 
            style={styles.TouchableOpacityStyle} 
            onPress={this.UpdateAnggotaRecord} >
   
            <Text style={styles.TextStyle}> Perbaharui Data </Text>
   
         </TouchableOpacity>
   
         <TouchableOpacity activeOpacity = { .4 } 
            style={styles.TouchableOpacityStyle} 
            onPress={this.DeleteAnggotaRecord} >
   
            <Text style={styles.TextStyle}> Hapus Data </Text>
   
         </TouchableOpacity>
    
   
   </View>
              
      );
    }
 
}
 
export default MyNewProject = StackNavigator(
 
  {
 
    First: { screen: MainActivity },
 
    Second: { screen: ShowAnggotaListActivity },
 
    Third: { screen: EditAnggotaRecordActivity }
 
  });
 
const styles = StyleSheet.create({
 
  MainContainer :{
 
    alignItems: 'center',
    flex:1,
    paddingTop: 10,
    backgroundColor: '#00B8D4'
 
  },
 
  MainContainer_For_Show_AnggotaList_Activity :{
    
    flex:1,
    paddingTop: (Platform.OS == 'ios') ? 20 : 0,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: 'white'
    
    },
 
  TextInputStyleClass: {
 
  textAlign: 'center',
  width: '90%',
  marginBottom: 7,
  height: 40,
  borderWidth: 1,
  borderColor: 'white',
  borderRadius: 5 ,
 
  },
 
  TouchableOpacityStyle: {
 
    paddingTop:10,
    paddingBottom:10,
    borderRadius:5,
    marginBottom:7,
    width: '90%',
    backgroundColor: '#FF9800'
 
  },
 
  TextStyle:{
    color:'#fff',
    textAlign:'center',
  },
 
  rowViewContainer: {
    fontSize: 20,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  }
 
});
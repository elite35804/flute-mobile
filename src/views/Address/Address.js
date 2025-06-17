import React, {useEffect, useRef, useState} from "react";
import styled from 'styled-components';
import SendSMS from 'react-native-sms'
import SendIntentAndroid from 'react-native-send-intent';
import Contacts from 'react-native-contacts';
import {
  MainMediumFont,
  MainRegularFont,
  MainSemiBoldFont, StyledText
} from "@/views/Components/controls/Text";
import {Images} from "@/styles/Images";
import {FlatList, Platform, TouchableOpacity, View} from "react-native";
import {ModalHeader} from "@/views/Components/ModalHeader";
import {useOvermind} from "@/store";
import {Search} from "@/views/Components";
import _ from 'lodash';
import {defaultAvatar} from "@/utils/Utils";
import {check, PERMISSIONS, request, requestMultiple} from "react-native-permissions";

let contacts = null;

const Address = (props) => {
  const {state, actions} = useOvermind();
  const [keyword, setKeyword] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState([]);
  const contactRef = useRef(null);
  useEffect(() => {
    _requestContacts();
  }, []);

  const getContacts = async () => new Promise((resolve, reject) => {
    Contacts.getAll().then((contacts) => {
      console.log(contacts, 'contacts')

      const users = [];
      let idx = 0;

      _.each(contacts, (contact) => {
        const mobiles = contact.phoneNumbers && contact.phoneNumbers.length ? contact.phoneNumbers : [];
        const emails = contact.emailAddresses && contact.emailAddresses.length ? contact.emailAddresses : [];
        if (mobiles[0] || emails[0]) {
          idx += 1;
          users.push({
            userId: `_contact_${idx}`,
            isContact: true,
            userName: `${contact.givenName} ${contact.familyName}`,
            avatar: contact.thumbnailPath,
            mobile: mobiles.length ? mobiles[0].number : null,
            email: emails.length ? emails[0].email : null,
            mobiles: _.map(mobiles, m => m.number),
            emails: _.map(emails, m => m.email),
          });
        }
      })
      users.sort((a, b) => a.userName > b.userName ? 1 : -1);
      resolve(users)
      return users;
    }).catch(e => {console.log(e); reject(e)});
  });

  const _requestContacts = async () => {
    // actions.hud.show();
    try {
      if (Platform.OS === 'ios') {
        contacts = await getContacts();
      } else {
        requestMultiple([PERMISSIONS.ANDROID.READ_CONTACTS, PERMISSIONS.ANDROID.WRITE_CONTACTS]).then(async status => {
          contacts = await getContacts();
        });
      }
      // for (let i = 0; i< contacts.length; i++) {
      //   const numbers = _.get(contacts[i], "mobiles", []);
      //   const res = await actions.user.doAccountsExist({mobileNumbers: numbers});
      //   const __numbers = numbers.map(n=> n.replace(/[\)|\(|\-|\s]/g, ''));
      //   const users = res.filter(user => {
      //     const _phones = _.get(user, "phones", [])
      //       .map(p => _.get(p, "number", ""))
      //       .filter(n => n.length > 0);
      //     return __numbers.filter(n => _phones.indexOf(n) >= 0).length > 0
      //   });
      //
      //   if (users.length > 0){
      //     contacts[i] = Object.assign(contacts[i], {avatar: users[0].avatar, status: users[0].status});
      //   }
      // }
      _filterContacts(keyword);
    } catch (e) {
      console.log(e);
      // actions.hud.hide();
    } finally {
      // actions.hud.hide();
    }
  }

  const _filterContacts = (keyword) => {
    if (_.isEmpty(keyword)) {
      setFiltered(contacts);
    } else {
      keyword = keyword.trim().toLowerCase();
      setFiltered(contacts.filter(c => c.userName.toLowerCase().indexOf(keyword) >= 0));
    }
  };

  const _onPressItem = (item) => {
    const select = [...selected];
    const index = select.findIndex(el => el === item.userId);
    if (index >= 0) {
      select.splice(index, 1);
    } else {
      select.push(item.userId);
    }
    setSelected(select);
  };
  const alphas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  const _onChangeKeyword = (key) => {
    setKeyword(key);
    _filterContacts(key);
  };

  const _onPressInvite = async () => {
    if (!selected.length) {
      actions.alert.showError({message: 'Please select contacts to invite', title: 'Flute'});
      return;
    }

    await _requestInvite();
  };

  const _requestInvite = async () => {
    // actions.hud.show();
    try {
      const data = [];
      const con = [];
      selected.forEach((id) => {
        const index = contacts.findIndex(el => el.userId === id);
        if (index < 0) return;
        const contact = contacts[index];
        con.push({
          name: contact.userName,
          email: contact.email,
          mobile: contact.mobile,
          userId: state.currentUser.id
        });
        data.push(
          contact.mobile,
        )
      });

      let _contacts = data.map(n => n.replace(/[\)|\(|\-|\s]/g, ''));

      if (Platform.OS === 'ios') {
        await SendSMS.send(
          {
            body: 'It pays to drink with me! Get special drink offers from brands. Download Flute: https://qrco.de/beRBD8',
            recipients: _contacts,
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: true,
          },
          (completed, cancelled, error) => {
            console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + ' error: ' + error);
          }
        );
      } else {
        const recipients = _contacts.join(';');
        SendIntentAndroid.sendSms(
          recipients,
          'It pays to drink with me! Get special drink offers from brands. Download Flute: https://qrco.de/beRBD8'
        );
      }

      // await actions.user.inviteContact({contacts: con, userId: state.currentUser.id});
      // actions.hud.hide();
      actions.alert.showSuccess({message: "Your contacts have been invited to Flute", title: 'Flute'});
    } catch (ex) {
      console.log(ex);
      actions.alert.showError({message: 'Failed to invite friends', title: 'Flute'});
    }
  }

  const scrollToContact = (char) => {
    const index = contacts.findIndex(c => c.userName.charAt(0).toUpperCase() === char);
    if (contactRef.current === null || index < 0) return null;
    contactRef.current.scrollToIndex({animated: true, index});
  }
  const ITEM_HEIGHT = 75
  return (
    <Container>
      <ModalHeader title="Address Book" description="Invite friends" {...props} />
      <Search value={keyword} onChange={_onChangeKeyword} />
      <FlatList
        ref={contactRef}
        style={{marginRight: 20}}
        data={filtered}
        keyExtractor={(item, index) => `${index}_user`}
        // onScrollToIndexFailed={(info) => {
        //   console.log(info, 'info')
        //   const wait = new Promise((resolve) => setTimeout(resolve, 500));
        //   wait.then(() => {
        //     console.log('----------------')
        //     contactRef.current?.scrollToIndex({animated: true, index: info?.index});
        //   });
        // }}
        getItemLayout={(data, index) => ({length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index})}
        ListEmptyComponent={() => (
          <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
            <MainMediumFont style={{color: '#929292', fontSize: 20}}>No results found</MainMediumFont>
          </View>
        )}
        renderItem={(prop) => (
          <UserItem
            {...prop}
            onPress={_onPressItem}
            selected={selected.findIndex((el) => el === prop.item.userId) >= 0}
          />
        )}
      />
      <AddButton onPress={_onPressInvite}>
        <Title>INVITE</Title>
      </AddButton>
      <AlphaView>
        {alphas.map((a, i) => (
          <TouchableOpacity onPress={() => scrollToContact(a)} key={i}>
            <AlphaTitle>{a}</AlphaTitle>
          </TouchableOpacity>
        ))}
      </AlphaView>
    </Container>
  );
};

export default Address;

const AlphaTitle = styled(MainRegularFont)`
  font-size: 10px;
  line-height: 11px;
  text-align: center;
  color: #353535;
  margin-top: 6px;
`

const AlphaView = styled.View`
  position: absolute;
  right: 3px;
  top: 200px;
`

const UserItem = ({item, onPress, selected, index, ...props}) => (
  <ItemContainer onPress={() => {
    onPress(item, index)
  }}>
    <Content>
      <UserAvatar source={defaultAvatar(item)}/>
      <Info>
        <Name>{item.userName}</Name>
        <Phone>{item.mobile}</Phone>
      </Info>
    </Content>
    <View>
      {item.status ? <StyledText style={{fontSize: 12}}>{item.status}</StyledText> :
        <Check source={selected ? Images.ic_check : Images.ic_uncheck}/>
      }
    </View>
  </ItemContainer>
);

const Check = styled.Image`
  
`

const Title = styled(MainRegularFont)`
  font-size: 10px;
  line-height: 30px;
  align-self: center;
  color: #000;
  letter-spacing: 4.7px;
`

const AddButton = styled.TouchableOpacity`
  background-color: #D6B839;
  padding-vertical: 9px;
  border-radius: 2px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  shadow-color: black;
  margin-horizontal: 10px;
  margin-bottom: 20px;
`

const Phone = styled(MainRegularFont)`
  font-size: 12px;
  line-height: 13px;
  margin-top: 3px;
  color: black;
`

const Name = styled(MainSemiBoldFont)`
  font-size: 14px; line-height: 15px;
  color: black;
`

const Info = styled.View`
  margin-left: 25px;
  justify-content: center;
`;

const UserAvatar = styled.Image`
  width: 50px; height: 50px; border-radius: 25px; background-color: grey;
`

const Content = styled.View`
  flex-direction: row;
`;

const Container = styled.SafeAreaView`
  flex: 1;
`;

const ItemContainer = styled.TouchableOpacity`
  padding-left: 15px;
  padding-right: 20px;
  padding-top: 18px;
  padding-bottom: 10px;
  flex-direction: row;
  align-items: center; justify-content: space-between;
  border-bottom-width: 0.4px; border-color: #979797;
  height: 75px;
`;

import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {View, TouchableOpacity, FlatList, KeyboardAvoidingView, StyleSheet, ScrollView, Modal} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import {isNil, isEmpty, get, defaultTo} from 'lodash';
import Feather from 'react-native-vector-icons/Feather';

import {
  StyledText,
  BaseTextInput,
  TextButton,
  CloseButton,
  UserAvatar,
  ItemContainer,
  ItemSeparator,
} from '@/views/Components';
import {Spacing, FontSize} from '@/styles/Sizes';
import {Sizes, Styles, Colors} from '@/styles';
import {useDelay} from '@/hooks/Utils';
import {useOvermind} from '@/store';
import UserItem from './UserItem';

const UserRemoveButton = (props) => {
  return (
    <UserRemoveButtonContainer {...props}>
      <Feather name="x" color="black" size={15} />
    </UserRemoveButtonContainer>
  );
};

const UserRemoveButtonContainer = styled.TouchableOpacity`
  ${Styles.absolute_top}
  border-radius: 8px;
  width: 16px;
  height: 16px;
  background-color: white;
  ${Styles.center}
`;
export default UsersPickerModal = async ({isOpen, selected, addUserHandler, removeUserHandler, onClose, ...props}) => {
  const {state, actions} = useOvermind();
  const {window} = state;
  const theme = props.theme || useTheme();
  const [search, setSearch] = useState('');

  // Cached keyword for 300ms
  const [userSearchKeyword, setUserSearchKeyword] = useState(''); // TODO - Need this?
  const users = state.user.users;

  const delayedSearch = useDelay(() => {
    // setUserSearchKeyword(search)
    actions.user.filterUsers(search);
  });

  const filteredUsers = React.useMemo(() => {
    return (users || []).filter((u) => {
      return selected.findIndex((other) => u.id === other.id) < 0;
    });
  }, [selected, users]);

  function onPressClear() {
    onChangeText('');
  }

  function onChangeText(text) {
    setSearch(text);
    delayedSearch();
  }

  return (
    <Modal visible={isOpen} transparent={true} animationType={'slide'} statusBarTranslucent={true}>
      <MyModal>
        <KeyboardAvoiding behavior="padding" enabled={window.isiOS}>
          <Container>
            <InputContainer>
              <FilterInput
                placeholder="Search users..."
                placeholderTextColor={theme.colorTextInputTitle}
                value={search}
                onChangeText={onChangeText}
              />
              <ClearButton onPress={onPressClear}>CLEAR</ClearButton>
              <CloseButton onPress={onClose} />
            </InputContainer>
            <ScrollViewContainer>
              {!isEmpty(selected) ? (
                <UsersScrollView horizontal>
                  <SelectedUsers>
                    {selected.map((user) => (
                      <SelectedUser key={user.id}>
                        <UserAvatar
                          avatar={user.avatar}
                          fullName={defaultTo(
                            user.fullName,
                            `${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`
                          )}
                        />
                        <UserRemoveButton onPress={() => removeUserHandler(user)} />
                      </SelectedUser>
                    ))}
                  </SelectedUsers>
                </UsersScrollView>
              ) : (
                <NoItemsText>No users selected</NoItemsText>
              )}
            </ScrollViewContainer>
            <ItemSeparator />
            <UsersList
              data={filteredUsers}
              keyExtrator={(item, index) => item.id}
              renderItem={(props) => (
                <ItemContainer onPress={() => addUserHandler(props.item)}>{<UserItem {...props} />}</ItemContainer>
              )}
              ItemSeparatorComponent={ItemSeparator}
            />
          </Container>
        </KeyboardAvoiding>
      </MyModal>
    </Modal>
  );
};

const KeyboardAvoiding = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const MyModal = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: #00000080;
`;

const Container = styled.View`
  border-radius: ${Sizes.scale(10)}px;
  background-color: white;
  margin-top: ${Spacing.MD}px;
  flex: 1;
`;

const height = '70px';

const NoItemsText = styled(StyledText)`
  color: #d8d8d8
  padding-horizontal: ${Spacing.LG}px;
`;

const ScrollViewContainer = styled.View`
  width: 100%;
  height: ${height};
  justify-content: center;
`;

const UsersScrollView = styled.ScrollView`
  width: 100%;
  height: ${height};
`;

const SelectedUsers = styled.View`
  padding-horizontal: ${Spacing.MD}px;
  height: ${height};
  flex-direction: row;
  align-items: center;
`;

const UsersList = styled.FlatList`
  flex: 1;
`;

const SelectedUser = styled.View`
  padding-horizontal: ${Spacing.XS}px;
  ${Styles.center}
`;

const InputContainer = styled.View`
  ${Styles.start_center}
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  border-bottom-color: #bbb;
  flex-direction: row;
  height: ${Sizes.scale(60)}px;
  padding-left: ${Spacing.LG}px;
  padding-right: ${Spacing.XS}px;
`;

const FilterInput = styled(BaseTextInput)`
  font-size: ${FontSize.Large}px;
  flex: 1;
  color: black;
`;

const ClearButton = styled(TextButton)`
  font-size: ${FontSize.Small}px;
  color: ${Colors.darkText};
`;

const ItemsList = styled(FlatList)`
  flex: 1;
`;

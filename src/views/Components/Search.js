import React from "react";
import styled from 'styled-components';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';

const Search = ({value, onChange, ...props}) => {
  return (<Container {...props}>
    <SLIcon name="magnifier" size={22} color="#929292"/>
    <SearchInput placeholder="Search" placeholderTextColor="#929292" returnKeyType="done" value={value}
                 onChangeText={onChange}/>
  </Container>)
};

export default Search;

const Container = styled.View`
  flex-direction: row;
  background-color: white;
  padding-horizontal: 10px;
  margin-horizontal: 15px;
  z-index: 10;
  margin-bottom: 5px;
  height: 52px;
  border-radius: 5px;
  align-items: center;
`;

const SearchInput = styled.TextInput`
  padding-vertical: 16px;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  margin-left: 10px;
  flex: 1;
  align-self: stretch;
  color: black;
`;

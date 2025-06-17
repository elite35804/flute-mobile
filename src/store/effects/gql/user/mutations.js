import gql from 'graphql-tag';
import { userFragment, AuthPayLoad } from './fragments';

/*
*
*/
export const saveUser = gql`
  mutation saveUser($data: UserUpdateInput!, $where: UserWhereUniqueInput) {
    saveUser(data: $data, where: $where) ${userFragment}
  }
`;

/*
*
*/
export const deleteUser = gql`
  mutation deleteUser($where: UserWhereUniqueInput) {
    deleteUser(where: $where) ${userFragment}
  }
`;

/*
*
*/
export const createAppUser = gql`
    mutation createAppUser(
    $generateToken: Boolean,
    $mobileNumber: String!
    $gps: GeoLocCreateInput
    $disableSendingSmsCode: Boolean
  ) {
    createAppUser(
      generateToken: $generateToken,
      mobileNumber: $mobileNumber
      gps: $gps
      disableSendingSmsCode: $disableSendingSmsCode
    ) ${AuthPayLoad}
  }
`;

/*
*
*/
export const verifySmsCode = gql`
  mutation verifySmsCode($userId: String! $verifyCode: String! $mobileNumber: String! $device: Json) {
    verifySmsCode(userId: $userId verifyCode: $verifyCode mobileNumber: $mobileNumber device: $device) {
      user {
        id
      }
      token
    }
  }
`;

/*
*
*/
export const login = gql`
  mutation login($email:String! $password:String!) {
    login(email:$email password:$password) {
      token
      user ${userFragment}
    }
  }
`;

/*
*
*/
export const loginWithToken = gql`
  mutation loginWithToken($token:String! $userId:String! $appVersion:String) {
    loginWithToken(token:$token userId:$userId appVersion:$appVersion) {
      user ${userFragment}
    }
  }
`;

/*
*
*/
export const triggerPasswordReset = gql`
  mutation triggerPasswordReset($email:String! $domain:String!) {
    triggerPasswordReset(email:$email domain:$domain)
  }
`;

/*
*
*/
export const passwordReset = gql`
  mutation passwordReset($email:String! $resetToken:String! $password:String!) {
    passwordReset(email:$email resetToken:$resetToken password:$password)
  }
`;

/*
*
*/
export const requestSupport = gql`
  mutation requestSupport($userId: String! $subject: String! $message: String!) {
    requestSupport(userId: $userId subject: $subject message: $message)
  }
`;

export const updateUserProfile = gql `
  mutation updateUser(
    $userId: String!,
    $email: String,
    $avatar: String,
    $firstName: String,
    $middleName: String,
    $lastName: String,
    $gender: String,
    $dateOfBirth: DateTime,
    $paymentMethod: PaymentMethodInput,
    $removePaymentMethods: [String],
    $setDefaultPaymentMethodId: String,
    $removeEmails: [String],
    $removePhones: [String],
    $createCompanies: [CompanyCreateInput!],
    $connectCompanies: [CompanyWhereUniqueInput!],
    $createAddresses: [SiteCreateInput!],
    $connectAddresses: [SiteWhereUniqueInput!],
    $settings: UserSettingCreateInput
    $defaultPaymentType: String
    $googlePlacesId: String
    $gps: GeoLocCreateInput
    $address2: String
    $addressNumber: String
    $addressName: String
    $siteId: String
    $checkFullAddress: Boolean
    $username: String
  ) {
    updateUser(
      userId: $userId,
      email: $email,
      avatar: $avatar,
      firstName: $firstName,
      middleName: $middleName,
      lastName: $lastName,
      gender: $gender,
      dateOfBirth: $dateOfBirth,
      paymentMethod: $paymentMethod,
      removePaymentMethods: $removePaymentMethods,
      setDefaultPaymentMethodId: $setDefaultPaymentMethodId,
      removeEmails: $removeEmails,
      removePhones: $removePhones,
      createCompanies: $createCompanies,
      connectCompanies: $connectCompanies,
      createAddresses: $createAddresses,
      connectAddresses: $connectAddresses,
      settings: $settings
      defaultPaymentType: $defaultPaymentType
      googlePlacesId: $googlePlacesId
      gps: $gps
      address2: $address2
      addressNumber: $addressNumber
      addressName: $addressName
      siteId: $siteId
      checkFullAddress: $checkFullAddress
      username: $username
    ) {
      user${userFragment}
    }
  }
`;

export const deleteUserAddress = gql`
  mutation deleteUserAddress($siteId: String! $userId: String!){
    deleteUserAddress(siteId: $siteId, userId: $userId)${userFragment}
  }
`

export const deactivateUser = gql`
 mutation deactivateUser(
    $userId: String!
  ) {
    deactivateUser(
      userId: $userId
    )
  }
  `

export const validateFluteCode = gql`
  mutation validateFluteCode(
    $promoCode: String!,
    $userId: String!,
    $image: String,
    $locationPlaceId: String
  ) {
    validateFluteCode(
      promoCode: $promoCode,
      userId: $userId,
      image: $image,
      locationPlaceId: $locationPlaceId
    )
  }
  `

export const sendFlutes = gql`
  mutation sendFlutes(
    $fromUserId: String!
    $toFlutes: [ToFlute!]
    $useWallet: Boolean
  ) {
    sendFlutes(
      toFlutes: $toFlutes,
      fromUserId: $fromUserId,
      useWallet: $useWallet
    )
  }
`

export const doAccountsExist = gql`
   mutation doAccountsExist(
    $mobileNumbers: [String]
  ) {
    doAccountsExist(
      mobileNumbers: $mobileNumbers
    ) {
      id avatar username phones{ number verified} status
    }
  }
`

export const inviteContact = gql`
  mutation inviteContact(
     $contacts: [InviteContactCreateInput!]
     $userId: String!
  ) {
    inviteContact(
      contacts: $contacts
      userId: $userId
    )
  }
  `

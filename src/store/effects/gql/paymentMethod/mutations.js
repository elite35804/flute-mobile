import gql from 'graphql-tag';
import { paymentMethodFragment } from './fragments';

export const savePaymentMethod = gql`
  mutation savePaymentMethod($data: PaymentMethodUpdateInput!, $where: PaymentMethodWhereUniqueInput) {
    savePaymentMethod(data: $data, where: $where) ${paymentMethodFragment}
  }
`;

export const deletePaymentMethod = gql`
  mutation deletePaymentMethod($where: PaymentMethodWhereUniqueInput) {
    deletePaymentMethod(where: $where) ${paymentMethodFragment}
  }
`;

export const generateBraintreeClientToken = gql`
  mutation generateBraintreeClientToken($customerId: String!) {
    generateBraintreeClientToken(customerId: $customerId)
  }
`;
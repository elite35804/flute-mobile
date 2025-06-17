import gql from 'graphql-tag';

export const cartFragment = gql`
  {
    id
    subtotal
    tipPercentage
    tip
    dueNow
    tax
    total
    discount
    delivery
    shipping
    serviceFee
    wallet
    metadata
    isPending
    createdAt
    updatedAt
    retailers
    event {
      id
      name
      days {
        id
        name
        startDate
      }
    }
    items {
      id
      name
      description
      priceEach
      quantity
      deliverBy
      rating
      isReviewed
      modifiers {
        id
        name
        sortOrder
        ingredient {
          id
          name
        }
      }
      campaign {
        id
        discountType
        discountAmount
        ads {
          id
          images {
            id
          }
        }
        maxItemsPer
        survey {
          id
          questions {
            id
            group {
              id
              name
            }
            question
            category
          }
        }
      }
      deliverTo {
        id
        name
        address
        address2
        state
        city
        postalCode
        country
        phones {
          id
          number
        }
      }
      product {
        id
        name
        description
        isAddOn
        pricing {
          id
          type
          retailPrice
        }
        images {
          id
          url
        }
        tasks {
          id
          ingredient {
            id
            name
          }
        }
      }
    }
  }
`;

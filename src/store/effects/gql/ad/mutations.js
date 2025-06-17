import gql from 'graphql-tag';
import {adFragment} from './fragments';

export const saveAd = gql`
  mutation saveAd($data: AdUpdateInput!, $where: AdWhereUniqueInput) {
    saveAd(data: $data, where: $where) ${adFragment}
  }
`;

export const deleteAd = gql`
  mutation deleteAd($where: AdWhereUniqueInput) {
    deleteAd(where: $where) ${adFragment}
  }
`;

export const checkForQualifiedAds = gql`
  mutation checkForQualifiedAds($userId: String!, $ad: GeoLocCreateInput, $siteId: String, $isDelivery: Boolean) {
    checkForQualifiedAds(userId: $userId, ad: $ad, siteId: $siteId, isDelivery: $isDelivery) {
      id
      playerId
      chatId
      showAds {
        id
        accepted
        campaign {
          id
          name
          isDelivery
          ads {
            id
            name
            subTitle
            images {
              iPhone
              android
            }
            sponsorLine1
            sponsorLogo
            sponsorLine2
            backgroundImage
            title
            description
            description2
            image
            brandLogo
            ingredients
            status
            footerDescription
            validThroughDate
            recipeUrl
            textColor
            buttonColor
          }
          allowedParticipants
          discountAmount
          discountType
          endDate
          exceededParticipantTarget
          groupName
          isActive
          isDelivery
          maxItemsPer
          metadata
          name
          pnMessage
          products {
            id
            name
            description
            blurb
            isAddOn
            isFree
            isTaxable
            onSale
            site {
              id
            }
            images {
              id
              name
              source
              url
            }
            pricing {
              id
              type
              retailPrice
              salePrice
            }
          }
          redemptionCount
          siteRestrictions {
            id
          }
          startDate
          survey {
            id
          }
          title
        }
        ad {
          id
        }
      }
    }
  }
`;

export const checkForQualifiedAdsByLocation = gql`
  mutation checkForQualifiedAdsByLocation(
    $ad: GeoLocCreateInput
    $siteId: String
    $userId: String
    $isDelivery: Boolean
  ) {
    checkForQualifiedAdsByLocation(ad: $ad, siteId: $siteId, userId: $userId, isDelivery: $isDelivery)
  }
`;

export const dismissAd = gql`
  mutation dismissAd(
    $impressionId: String!
    $userId: String!
    $campaignId: String!
    $adId: String!
    $accepted: Boolean!
  ) {
    dismissAd(impressionId: $impressionId, userId: $userId, campaignId: $campaignId, accepted: $accepted, adId: $adId) {
      id
    }
  }
`;

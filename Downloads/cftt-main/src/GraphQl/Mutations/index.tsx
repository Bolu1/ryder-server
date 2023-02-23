import { gql } from "@apollo/client";

export const MESSAGE_IMAGE_UPLOAD = gql`
  mutation uploadMessageContentImage($messageId: String! $file: Upload!) {
    uploadMessageContentImage(messageId: $messageId file: $file) 
  }
`;

export const SERMON_IMAGE_UPLOAD = gql`
  mutation uploadSermonContentImage($sermonId: String! $file: Upload!) {
    uploadSermonContentImage(sermonId: $sermonId file: $file) 
  }
`;
export const PASTOR_FORUM_IMAGE_UPLOAD = gql`
  mutation uploadContentImageForPastorForumMessage($messageId: String! $file: Upload!) {
    uploadContentImageForPastorForumMessage(messageId: $messageId file: $file) 
  }
`;
export const UPLOAD_AVATAR = gql`
  mutation uploadAvatar($file: Upload!) {
    uploadAvatar(file: $file) 
  }
`;
export const LOGIN = gql`
  mutation login($creds:  LoginInput!) {
    login(creds: $creds ) {
      token
      admin{
        _id
        email
        phone
        full_name
        code
        avatar
        role{
            _id
            name
            permissions{
              _id
              name
              description
              module
            }
        }
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const INITIATE_FORGOT_PASSWORD = gql`
  mutation initiateForgotPassword($email:  String!) {
    initiateForgotPassword(email: $email ) {
      msg
    }
  }
`;

export const CONFIRM_PASSWORD = gql`
  mutation confirmPassword($new_password: String! $code: String!){
    confirmPassword(new_password: $new_password code: $code ) {
      msg
    }
  }
`;
export const UPDATE_PROFILE = gql`
mutation updateadmin($input: AdminInput!, $adminId:String!){
  updateadmin(input: $input adminId: $adminId) {
    id
    email
    phone
    full_name
    code
    avatar
    role{
      id
      name
      permissions{
        id
        name
        description
        module
      }
  }
    status
    createdAt
    updatedAt

  }
}
`;

export const CHANGE_PASSWORD = gql`
mutation updatePassword($newPassword: String! $oldPassword: String!){
  updatePassword(newPassword: $newPassword oldPassword: $oldPassword) {
    id
    email
    phone
    full_name
    code
    status
    createdAt
    updatedAt
  }
}
`;


export const CREATE_ADMIN = gql`
  mutation register($input: AdminInput!){
      register(input: $input) {
        email
        phone
        full_name
        role
        status
        createdAt
        updatedAt
      }
  }
`;

export const INVITE_ADMIN =gql`
  mutation inviteAdmin($email: String! $role: String!){
    inviteAdmin(email:$email role:$role){
      msg
    }
  }
`;

// ROLES
export const CREATE_ROLE =gql`
  mutation createRole($permissions: [String!]! $name: String!){
    createRole(permissions:$permissions name:$name){
      id
    }
  }
`;
export const EDIT_ROLE =gql`
  mutation updateRole($permissions: [String!]! $id: String! $name: String!){
    updateRole(permissions:$permissions id:$id name:$name){
      id
    }
  }
`;
export const CHANGE_ADMIN_ROLE =gql`
  mutation updateadmin($adminId:String! $input: AdminInput!){
    updateadmin(adminId:$adminId input:$input){
      id
    }
  }
`;

export const ACTIVATE_ADMIN =gql`
  mutation activateAdmin($adminID: String!){
    activateAdmin(adminID:$adminID){
      id
      email
      phone
      full_name
      code
      role{
        id
        name
        permissions{
          id
          name
          description
          module
        }
      }
      status
      createdAt
      updatedAt
  
    }
  }
`;
export const DEACTIVATE_ADMIN =gql`
  mutation deactivateAdmin($adminID: String!){
    deactivateAdmin(adminID:$adminID){
      _id
      email
      phone
      full_name
      code
      role{
        _id
        name
        createdAt
        updatedAt
        }
      avatar
      status
      createdAt
      updatedAt
  
    }
  }
`;

export const ACTIVATE_USER =gql`
  mutation unSuspendUser($userID: String!){
    unSuspendUser(userID:$userID){
      _id
      email
      phone
      full_name
      code
      avartar:
      branch
      status
      createdAt
      updatedAt
    }
  }
`;
export const DEACTIVATE_USER =gql`
  mutation suspendUser($userID: String!){
    suspendUser(userID:$userID){
      _id
      email
      phone
      full_name
      code
      avartar:
      branch
      status
      createdAt
      updatedAt
  
    }
  }
`;


export const CREATE_BRANCH = gql`
  mutation createBranch($input:  BranchInput!) {
    createBranch(input: $input ) {
      _id
      name
      branch_president
      geo_point{
        lat
        long
      }
      branch_address
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BRANCH = gql`
  mutation updateBranch($input:  BranchInput! $branchId: String!) {
    updateBranch(input: $input branchId: $branchId ) {
      _id
      name
      branch_president
      geo_point{
        lat
        long
      }
      branch_address
      status
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_GROUP = gql`
  mutation createGroup($input:  GroupInput!) {
    createGroup(input: $input ) {
      _id
      name
      group_head
      createdAt
      updatedAt
    }
  }
`;
export const UPDATE_GROUP = gql`
  mutation updateGroup($input:  GroupInput! $groupId: String!) {
    updateGroup(input: $input groupId:$groupId ) {
      _id
      name
      group_head
      createdAt
      updatedAt
    }
  }
`;
// MESSAGES
export const CREATE_MESSAGE = gql`
  mutation createMessage($input:  MessageInput!) {
    createMessage(input: $input ) {
      _id
      title
      minister
      image
      bibleReading{
        text
        refrence
      }
      message
      prayer_point
      category
      
    }
  }
`;

export const EDIT_MESSAGE = gql`
  mutation updateMessage($messageId: String! $input:  MessageInput!) {
    updateMessage(messageId: $messageId  input: $input ) {
      _id
      title
      minister
      image
      bibleReading{
        text
        refrence
      }
      message
      prayer_point
      category
    

    }
  }
`;

export const PUBLISH_MESSAGE =gql`
  mutation publishDeskMessage($messageId: String!) {
    publishDeskMessage(messageId: $messageId ) {
      _id
    }
  }
`;

export const UNPUBLISH_MESSAGE =gql`
  mutation unPublishDeskMessage($messageId: String!) {
    unPublishDeskMessage(messageId: $messageId) {
      _id
    }
  }
`;

export const DELETE_MESSAGE =gql`
  mutation deleteMessage($messageId: String!) {
    deleteMessage(messageId: $messageId) {
      msg
    }
  }
`;


export const CREATE_PRAYER = gql`
  mutation createPrayer($input: PrayerInput!) {
    createPrayer(input: $input ) {
      _id
      title
      subtitle
      author
      createdAt
    }
  }
`;

export const EDIT_PRAYER = gql`
  mutation updatePrayer($prayerId: String! $input: PrayerInput!) {
    updatePrayer(prayerId: $prayerId input: $input ) {
      _id
      title
      subtitle
      author
      createdAt
    }
  }
`;

export const PUBLISH_PRAYER =gql`
  mutation publishPrayer($prayerId: String!) {
    publishPrayer(prayerId: $prayerId ) {
      _id
    }
  }
`;

export const UNPUBLISH_PRAYER =gql`
  mutation unPublishPrayer($prayerId: String!) {
    unPublishPrayer(prayerId: $prayerId) {
      _id
    }
  }
`;

export const DELETE_PRAYER =gql`
  mutation deletePrayer($prayerId: String!) {
    deletePrayer(prayerId: $prayerId) {
      msg
    }
  }
`;


// DAILY PRAYERS
export const CREATE_DAILY_PRAYER = gql`
  mutation createDailyPrayer($input: DailyPrayerInput!) {
    createDailyPrayer(input: $input ) {
      day
      subtitle
      scripture{
        text
        refrence
      }
      heading
      content
      supportingVerse{
        text
        refrence
      }
      prayer_points
      prayerMannerId
      createdAt
    }
  }
`;

export const EDIT_DAILY_PRAYER = gql`
  mutation updateDailyPrayer($input: DailyPrayerInput! $dailyPrayerId: String!) {
    updateDailyPrayer(input: $input dailyPrayerId: $dailyPrayerId) {
      day
      subtitle
      scripture{
        text
        refrence
      }
      heading
      content
      supportingVerse{
        text
        refrence
      }
      prayer_points
      prayerMannerId
      createdAt
    }
  }
`;

// Bible study
export const CREATE_BIBLE_STUDY = gql`
  mutation createBibleStudyContent($input:BibleStudyInput!) {
    createBibleStudyContent(input: $input ) {
      _id
      topic
      minister
      memoryVerse{
        text
        refrence
      }
      message
      createdAt
    }
  }
`;

export const UPDATE_BIBLE_STUDY = gql`
  mutation updateBibleStudyContent($biibleStudyContentId:String! $input:BibleStudyInput!) {
    updateBibleStudyContent(biibleStudyContentId:$biibleStudyContentId  input: $input ) {
      _id
      topic
      minister
      memoryVerse{
        text
        refrence
      }
      message
      createdAt
    }
  }
`;
export const UNPUBLISH_BIBLE_STUDY =gql`
  mutation unPublishBibleStudyContent($biibleStudyContentId: String!) {
    unPublishBibleStudyContent(biibleStudyContentId: $biibleStudyContentId) {
      _id
    }
  }
`;

export const PUBLISH_BIBLE_STUDY =gql`
  mutation publishBibleStudyContent($biibleStudyContentId: String!) {
    publishBibleStudyContent(biibleStudyContentId: $biibleStudyContentId) {
      _id
    }
  }
`;

export const DELETE_BIBLE_STUDY =gql`
  mutation deleteBibleStudyContent($bibleStudyContentId: String!) {
    deleteBibleStudyContent(bibleStudyContentId: $bibleStudyContentId) {
      msg
    }
  }
`;

// SERMONS
export const CREATE_SERMON = gql`
mutation createSermon($input:SermonInput!) {
  createSermon(input: $input ) {
    _id
    title
    minister
    image
    bibleReading{
      text
      refrence
    }
    message
    prayer_point
    published
    minuteRead
    createdAt
    updatedAt
  }
}
`;

export const UPDATE_SERMON = gql`
mutation updateSermon($input:SermonInput! $sermonId: String!) {
  updateSermon(input: $input sermonId: $sermonId) {
    _id
    title
    minister
    image
    bibleReading{
      text
      refrence
    }
    message
    prayer_point
    published
    minuteRead
    createdAt
    updatedAt
  }
}
`;

export const UNPUBLISH_SERMON =gql`
  mutation unPublishSermon($sermonId: String!) {
    unPublishSermon(sermonId: $sermonId) {
      _id
    }
  }
`;

export const PUBLISH_SERMON =gql`
  mutation publishSermon($sermonId: String!) {
    publishSermon(sermonId: $sermonId) {
      _id
    }
  }
`;

export const DELETE_SERMON =gql`
  mutation deleteSermon($sermonId: String!) {
    deleteSermon(sermonId: $sermonId) {
      msg
    }
  }
`;

// Pastors forum
export const CREATE_PASTOR_FORUM_MESSAGE = gql`
mutation createMessageForPastorForum($input: PastorForumInput!) {
  createMessageForPastorForum(input: $input ) {
    _id
    title
    minister
    image
    bibleReading{
      text
      refrence
    }
    message
    prayer_point
    published
    minuteRead
    createdAt
    updatedAt
  }
}
`;

export const EDIT_PASTOR_FORUM_MESSAGE = gql`
mutation uppdateMessageForPastorForum($messageId: String! $input: PastorForumInput!) {
  uppdateMessageForPastorForum(messageId:$messageId input:$input ) {
    _id
    title
    minister
    image
    bibleReading{
      text
      refrence
    }
    message
    prayer_point
    published
    minuteRead
    createdAt
    updatedAt
  }
}
`;
export const PUBLISH_PASTOR_FORUM_MESSAGE =gql`
  mutation publishMessageForPastorForum($messageId: String!) {
    publishMessageForPastorForum(messageId: $messageId) {
      _id
    }
  }
`;

export const UNPUBLISH_PASTOR_FORUM_MESSAGE =gql`
  mutation unPublishMessageForPastorForum($messageId: String!) {
    unPublishMessageForPastorForum(messageId: $messageId) {
      _id
    }
  }
`;

export const DELETE_PASTOR_FORUM_MESSAGE =gql`
  mutation deleteMessageForPastorForum($messageId: String!) {
    deleteMessageForPastorForum(messageId: $messageId) {
      msg
    }
  }
`;

// daily bible reading
export const CREATE_DAILY_BIBLE_READING = gql`
mutation createDailyBibleContent($input:  DailyBibleReadingInput!) {
  createDailyBibleContent(input: $input) {
    _id
    verseContent
    verseOfTheDayText
    bibleText
    published
    publishedAt
    createdAt
    updatedAt
  }
}
`;
export const EDIT_DAILY_BIBLE_READING = gql`
mutation updateDailyBibleContent($input:  DailyBibleReadingInput! $biibleReadingContentId: String!) {
  updateDailyBibleContent (input: $input biibleReadingContentId: $biibleReadingContentId) {
    _id
    verseContent
    verseOfTheDayText
    bibleText
    published
    publishedAt
    createdAt
    updatedAt
  }
}
`;
export const DELETE_DAILY_BIBLE_READING =gql`
  mutation deleteDailyBibleContent($biibleReadingContentId: String!) {
    deleteDailyBibleContent(biibleReadingContentId: $biibleReadingContentId) {
      msg
    }
  }
`;

// events
export const CREATE_EVENT = gql`
mutation createEvent($input: EventInput!) {
  createEvent(input: $input) {
    _id
    eventName
    startDate
    endDate
    time
    repeat
    repeatId
    createdAt
    updatedAt
  }
}
`;

export const UPDATE_EVENT = gql`
mutation updateEvent($input: EventInput! $eventId: String!) {
  updateEvent(input: $input eventId: $eventId) {
    _id
    eventName
    startDate
    endDate
    time
    repeat
    repeatId
    createdAt
    updatedAt
  }
}
`;

export const CREATE_CHILD_EVENT = gql`
mutation createChildEvent($input:  ChildEventInput! ) {
  createChildEvent(input: $input) {
    _id
    eventTheme
    day
    time
    eventId
    createdAt
    updatedAt
  }
}
`;
export const EDIT_CHILD_EVENT = gql`
mutation updateChildEvent($childId : childId $input:  ChildEventInput! ) {
  updateChildEvent(childId: $childId input: $input) {
    _id
    eventTheme
    day
    time
    eventId
    createdAt
    updatedAt
  }
}
`;
export const DELETE_EVENT =gql`
  mutation deleteEvent($childId: String!) {
    deleteEvent(childId: $childId) {
      msg
    }
  }
`;
// appointments
export const CREATE_NEW_TIME_SLOT =gql`
  mutation createNewTimeSlot($input: SlotInput!) {
    createNewTimeSlot(input: $input) {
      _id
      startDate
      endDate
      startTime
      endTime
      adminID
      available
      createdAt
      updatedAt
    }
  }
`;
export const UPDATE_TIME_SLOT =gql`
  mutation updateTimeSlot($id: String! $input: SlotInput!) {
    updateTimeSlot(id:$id  input: $input) {
      _id
      startDate
      endDate
      startTime
      endTime
      adminID
      available
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_APPOINTMENT =gql`
  mutation updateAppointment($id: String! $status: String!) {
    updateAppointment(id:$id  status: $status) {
      _id
      name
      email
      slot{
          _id
          startDate
          endDate
          startTime
          endTime
          adminID
          available
          createdAt
          updatedAt
      }
      agendaDescription
      adminID
      status
      createdAt
      updatedAt
    }
  }
`;
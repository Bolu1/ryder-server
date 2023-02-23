import { gql } from '@apollo/client';


export const GET_ALL_BIBLE_VERSIONS = gql`
  query VersionDTO {
    getBibleBookVersions {
      translation
    }
  }
`;
export const GET_ALL_BRANCHES = gql`
  query PaginatedBranchDTO ($query: String! $page: Float! $limit: Float!){
    getAllBranch (query:$query page:$page limit:$limit ){

      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      docs{
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
  }
`;

export const GET_ALL_USERS_IN_BRANCH = gql`
  query PaginatedUserDTO($branchName: String! $page: Float! $limit: Float!){
    getUsersInBranch(branchName:$branchName page:$page limit:$limit ){
      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      docs{
        email
        phone
        full_name
        church_group
        code
        avartar
        branch
        country
        account_verification
        reset_password
        status
        createdAt
        updatedAt
      }

    }
  }
`;
// Dashboard
export const DASHBOARD_USER_COUNT = gql`
  query DashboardUserCountDTO {
    dashboardUserCount {
      totalNumberOfAdmins
      totalNumberOfActiveUsers
      totalNumberOfSuspendedUsers
    }
  }
`;

export const DASHBOARD_GET_REVENUE = gql`
  query DashboardGraphDTO ($startDate: String! $endDate: String!) {
    dashBoardGraph(startDate:$startDate endDate:$endDate) {
      totalDonations
      totalOfferings
      totalWelfare
    }
  }
`;

// Groups
export const GET_ALL_GROUPS = gql`
  query GroupDTO {
    getAllGroups {
      _id
      name
      group_head
      members{
        email
        _id
        phone
        full_name
        church_group
        branch
        country
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_SINGLE_GROUP = gql`
  query GroupDTO ($groupId: String!) {
    getGroup(groupId: $groupId) {
      _id
      name
      group_head
      members{
        email
        _id
        phone
        full_name
        church_group
        branch
        country
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

// Admins
export const GET_ALL_ADMINS = gql`
  query PaginatedAdminDTO($page: Float! $limit: Float! $query: String!){
    getAllAdmin(page:$page limit:$limit query:$query){
      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      docs {
        status
        createdAt
        updatedAt
        _id
        email
        phone
        full_name
        code
        role {
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
  }
`;

export const GET_SINGLE_ADMIN = gql`
  query AdminDTO($id: String!){
    getAdmin(id:$id){
      _id
      email
      phone
      full_name
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
`;

// Admins
export const GET_ALL_INVITED_ADMINS = gql`
query PaginatedAdminDTO($page: Float! $limit: Float! $query: String!){
  getAllInvitedAdmin(page:$page limit:$limit query:$query){
    totalDocs
    limit
    totalPages
    page
    pagingCounter
    hasPrevPage
    hasNextPage
    prevPage
    nextPage
    docs {
      status
      createdAt
      updatedAt
      _id
      email
      phone
      full_name
      code
      role {
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
}
`;

// Roles
export const GET_ALL_ROLES = gql`
  query PaginatedRoleDTO($page: Float! $limit: Float!){
    getRoles(page:$page limit:$limit ){
      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      docs{
        _id
        name
      }
      
    }
  }
`;
export const GET_SINGLE_ROLE = gql`
  query RoleDTO($id: String!){
    getRole(id:$id){
      id
      name
      permissions{
        id
        name
        description
        module
        moduleName
      }
    }
  }
`;

export const GET_ALL_PERMISSIONS = gql`
  query PermissionDTO{
    getPermissions{
      id
      name
      description
      module
      moduleName
    }
  }
`;

// Members
export const GET_ALL_MEMBERS = gql`
  query PaginatedUserDTO($page: Float! $limit: Float!){
    getAllUser(page:$page limit:$limit ){
      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      docs{
          _id
          email
          phone
          full_name
          church_group
          code
          avartar
          branch
          country
          account_verification
          reset_password
          status
          createdAt
          updatedAt
      }
    }
  }
`;
export const GET_SINGLE_MEMBER = gql`
  query UserDTO($userID: String!){
    getUser(userID: $userID){
      _id
      email
      phone
      full_name
      church_group
      code
      avartar
      branch
      country
      account_verification
      reset_password
      status
      createdAt
      updatedAt
    }
  }
`;

// Messages
export const GET_ALL_MESSAGES = gql`
  query  PaginatedApostleDeskDTO ($query: String! $flag: String! $page: Float! $limit: Float!){
    getAllMessages(query:$query flag:$flag page:$page limit:$limit ){
      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      docs{
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
          published
          minuteRead
          createdAt
          updatedAt
      }
    }
  }
`;

export const GET_SINGLE_MESSAGE = gql`
  query MessageDTO ($messageId: String!) {
    getMessage(messageId: $messageId) {
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
      createdAt
    }
  }
`;

export const GET_BIBLE_PASSAGE = gql`
  query VerseDTO ($verse: String! $chapter: String! $book: String! $version:String!) {
    getBibleBookVerse(verse: $verse chapter:$chapter book:$book version:$version) {
      num
      text
    }
  }
`;

export const GET_BIBLE_FULL_CHAPTER = gql`
  query ChapterDTO ($chapter: String! $book: String! $version:String!) {
    getBibleBookChapter( chapter:$chapter book:$book version:$version) {
      verse{
        num
        text
        }
      num
    }
  }
`;

// Prayers
export const GET_ALL_PRAYERS = gql`
query PrayerDTO ($query: String! $flag: String! $page: Float! $limit: Float!){
  getAllPrayers (query:$query flag:$flag page:$page limit:$limit ){
    totalDocs
    limit
    totalPages
    page
    pagingCounter
    hasPrevPage
    hasNextPage
    prevPage
    nextPage
    docs{
        _id
        title
        subtitle
        preface
        image
        author
        dailyPrayers{
          _id
          day
          subtitle
          scripture {
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
          published
          createdAt
          updatedAt
        }
        published
        createdAt
        updatedAt
        }
    }
}
`;

export const GET_SINGLE_PRAYER = gql`
query PrayerDTO  ($prayerId: String!) {
  getPrayer(prayerId: $prayerId) {
    _id
    title
    subtitle
    author
    preface
    dailyPrayers{
        _id
        day
        subtitle
        scripture {
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
        published
        createdAt
        updatedAt
    }
    publishedAt
    createdAt
  }
}
`;

// BIBLE STUDY
export const GET_ALL_BIBLE_STUDY_CONTENT = gql`
query PaginatedBibleStudyDTO($query: String! $flag: String! $page: Float! $limit: Float!){
  getAllBibleStudyContent(query:$query flag:$flag page:$page limit:$limit ){
      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      docs{
        _id
        topic
        minister
        memoryVerse{
          text
          refrence
        }
        message
        published
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_SINGLE_BIBLE_STUDY_CONTENT = gql`
  query BibleStudyDTO($bibleStudyContentId: String!) {
    getBibleStudyContent(bibleStudyContentId: $bibleStudyContentId) {
      _id
      topic
      minister
      memoryVerse{
        text
        refrence
      }
      publishedAt
      message
      createdAt
    }
  }
`;

// SERMONS
export const  GET_ALL_SERMONS = gql`
query SermonDTO($query: String! $flag: String! $page: Float! $limit: Float!){
  getAllSermons(query:$query flag:$flag page:$page limit:$limit ){
    totalDocs
    limit
    totalPages
    page
    pagingCounter
    hasPrevPage
    hasNextPage
    prevPage
    nextPage
    docs{
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
}
`;

export const  GET_SINGLE_SERMON = gql`
query SermonDTO($messageId: String!) {
  getSermon(messageId: $messageId) {
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
// Pastors forum
export const  GET_ALL_PASTORS_FORUM_MESSAGES = gql`
query PaginatedPastorForumDTO($query: String! $flag: String! $page: Float! $limit: Float!){
  getAllMessagesFromPastorForum(query:$query flag:$flag page:$page limit:$limit ){

    totalDocs
    limit
    totalPages
    page
    pagingCounter
    hasPrevPage
    hasNextPage
    prevPage
    nextPage
    docs{
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
}
`;

export const  GET_SINGLE_PASTORS_FORUM_MESSAGE = gql`
query PastorForumDTO($id: String!){
  getMessageDetailFromPastorForum(id:$id ){
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
// Daily bible reading

export const  GET_ALL_DAILY_BIBLE_READING = gql`
query DailyBibleReadingDTO($query: String! $flag: String! $page: Float! $limit: Float!){
  getAllDailyBibleContent(query:$query flag:$flag page:$page limit:$limit ){
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

export const  GET_SINGLE_DAILY_BIBLE_READING = gql`
query DailyBibleReadingDTO($biibleReadingContentId: String!){
  getDailyBibleContent(biibleReadingContentId:$biibleReadingContentId ){
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
// Calendar/events
export const GET_ALL_EVENTS = gql`
  query PaginateEventDTO($query: String! $date: String! $page: Float! $limit: Float!){
    getEvents(query:$query date:$date page:$page limit:$limit ){
      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      docs{
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
  }
`;

export const GET_SINGLE_EVENT = gql`
  query EventDTO($eventID: String!){
    getEvent(eventID:$eventID ){
      _id
      eventName
      startDate
      endDate
      time
      repeat
      repeatId
      childEvents{
        _id
        eventTheme
        day
        time
        eventId
        createdAt
        updatedAt
        }
      createdAt
      updatedAt
    }
  }
`;

// Transactions
export const GET_ALL_TRANSACTIONS = gql`
  query PaginatedTransactionDTO($page: Float! $limit: Float!  $status: String! $paymentMethod: String! $paymentType: String! $startDdate: String! $endDate: String!){
    getAllTransactions(page:$page limit:$limit  status:$status paymentMethod: $paymentMethod paymentType: $paymentType startDdate:$startDdate endDate:$endDate){
      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      docs{
        _id
        paymentType
        transactionId
        amount
        currency
        paymentPlatform
        transactionDate
        status
      }
    }
  }
`;
// Appointment module
export const GET_ALL_APPOINTMENTS = gql`
  query PaginatedAppointmentDTO($adminId: String! $flag: String! $page: Float! $limit: Float!){
    getAppointments(adminId:$adminId flag:$flag page:$page limit:$limit ){
      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      docs{
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
  }
`;
// Time slots
export const GET_ALL_TIME_SLOTS = gql`
  query SlotDTO($adminId: String!){
    getSlots(adminId:$adminId){
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
export const GET_SINGLE_TIME_SLOT = gql`
  query SlotDTO($id: String!){
    getSlot(id:$id){
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
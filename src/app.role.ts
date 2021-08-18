export enum AppRoles {
  /**
   * @UserModule
   */
  ADMIN_CREATE_ANY_USER = 'ADMIN_CREATE_ANY_USER',
  ADMIN_READ_ANY_USER = 'ADMIN_READ_ANY_USER',
  ADMIN_UPDATE_ANY_USER = 'ADMIN_UPDATE_ANY_USER',
  ADMIN_DELETE_ANY_USER = 'ADMIN_DELETE_ANY_USER',
  MODERATOR_UPDATE_OWN_USER = 'MODERATOR_UPDATE_OWN_USER',
  // CONTRIBUTOR_READ_ANY_USER = 'CONTRIBUTOR_READ_ANY_USER',

  /**
   * @CategoryModule
   */
  ADMIN_CREATE_ANY_CATEGORY = 'ADMIN_CREATE_ANY_CATEGORY',
  ADMIN_READ_ANY_CATEGORY = 'ADMIN_READ_ANY_CATEGORY',
  ADMIN_UPDATE_ANY_CATEGORY = 'ADMIN_UPDATE_ANY_CATEGORY',
  ADMIN_DELETE_ANY_CATEGORY = 'ADMIN_DELETE_ANY_CATEGORY',
  ADMIN_RESTORE_ANY_CATEGORY = 'ADMIN_RESTORE_ANY_CATEGORY',
  // MODERATOR_CREATE_ANY_CATEGORY = 'MODERATOR_CREATE_ANY_CATEGORY',
  // MODERATOR_READ_ANY_CATEGORY = 'MODERATOR_READ_ANY_CATEGORY',
  // MODERATOR_UPDATE_OWN_CATEGORY = 'MODERATOR_UPDATE_OWN_CATEGORY',
  // MODERATOR_DELETE_OWN_CATEGORY = 'MODERATOR_DELETE_OWN_CATEGORY',

  // /**
  //  * @TagModule
  //  */
  // ADMIN_CREATE_ANY_TAG = 'ADMIN_CREATE_ANY_TAG',
  // ADMIN_READ_ANY_TAG = 'ADMIN_READ_ANY_TAG',
  // ADMIN_UPDATE_ANY_TAG = 'ADMIN_UPDATE_ANY_TAG',
  // ADMIN_DELETE_ANY_TAG = 'ADMIN_DELETE_ANY_TAG',
  // MODERATOR_CREATE_ANY_TAG = 'MODERATOR_CREATE_ANY_TAG',
  // MODERATOR_READ_ANY_TAG = 'MODERATOR_READ_ANY_TAG',
  // MODERATOR_UPDATE_OWN_TAG = 'MODERATOR_UPDATE_OWN_TAG',
  // MODERATOR_DELETE_OWN_TAG = 'MODERATOR_DELETE_OWN_TAG',

  /**
   * @PermissionModule
   */
  ADMIN_CREATE_ANY_PERMISSION = 'ADMIN_CREATE_ANY_PERMISSION',
  ADMIN_READ_ANY_PERMISSION = 'ADMIN_READ_ANY_PERMISSION',
  ADMIN_UPDATE_ANY_PERMISSION = 'ADMIN_UPDATE_ANY_PERMISSION',
  ADMIN_DELETE_ANY_PERMISSION = 'ADMIN_DELETE_ANY_PERMISSION',
  ADMIN_READ_ANY_ROLE = 'ADMIN_READ_ANY_ROLE',

  /**
   * @AuthModule
   */
  ADMIN_READ_OWN_PROFILE = 'ADMIN_READ_OWN_PROFILE',
  ADMIN_UPDATE_OWN_PROFILE = 'ADMIN_UPDATE_OWN_PROFILE',
  // MODERATOR_UPDATE_OWN_PROFILE = 'MODERATOR_UPDATE_OWN_PROFILE',
  USER_UPDATE_OWN_PROFILE = 'USER_UPDATE_OWN_PROFILE',
  // CONTRIBUTOR_UPDATE_OWN_PROFILE = 'CONTRIBUTOR_UPDATE_OWN_PROFILE',
  // MODERATOR_READ_OWN_PROFILE = 'MODERATOR_READ_OWN_PROFILE',
  USER_READ_OWN_PROFILE = 'USER_READ_OWN_PROFILE',
  // CONTRIBUTOR_READ_OWN_PROFILE = 'CONTRIBUTOR_READ_OWN_PROFILE',
  // CONTRIBUTOR_UPDATE_ANY_PROFILE = 'CONTRIBUTOR_UPDATE_ANY_PROFILE',

  /**
  //  * @SkillModule
  //  */
  // USER_CREATE_ANY_SKILL = 'USER_CREATE_ANY_SKILL',
  // USER_UPDATE_OWN_SKILL = 'USER_UPDATE_OWN_SKILL',
  // USER_DELETE_OWN_SKILL = 'USER_DELETE_OWN_SKILL',

  // /**
  //  * @EducationModule
  //  */

  // USER_READ_ANY_EDUCATION = 'USER_READ_ANY_EDUCATION',
  // USER_CREATE_ANY_EDUCATION = 'USER_CREATE_ANY_EDUCATION',
  // USER_UPDATE_OWN_EDUCATION = 'USER_UPDATE_OWN_EDUCATION',
  // USER_DELETE_OWN_EDUCATION = 'USER_DELETE_OWN_EDUCATION',

  // /**
  //  * @ExperienceModule
  //  */
  // USER_READ_OWN_EXPERIENCE = 'USER_READ_OWN_EXPERIENCE',
  // USER_CREATE_ANY_EXPERIENCE = 'USER_CREATE_ANY_EXPERIENCE',
  // USER_UPDATE_OWN_EXPERIENCE = 'USER_UPDATE_OWN_EXPERIENCE',
  // USER_DELETE_OWN_EXPERIENCE = 'USER_DELETE_OWN_EXPERIENCE',

  /**
   * @JobModule
   */
  ADMIN_READ_ANY_JOB = 'ADMIN_READ_ANY_JOB',
  USER_READ_ANY_JOB = 'USER_READ_ANY_JOB',
  CONTRIBUTOR_CREATE_ANY_JOB = 'CONTRIBUTOR_CREATE_ANY_JOB',
  CONTRIBUTOR_READ_OWN_JOB = 'CONTRIBUTOR_READ_OWN_JOB',
  // MODERATOR_READ_ANY_JOB = 'MODERATOR_READ_ANY_JOB',
  // MODERATOR_UPDATE_ANY_JOB = 'MODERATOR_UPDATE_ANY_JOB',
  // MODERATOR_DELETE_ANY_JOB = 'MODERATOR_DELETE_ANY_JOB',
  ADMIN_DELETE_ANY_JOB = 'ADMIN_DELETE_ANY_JOB',
  ADMIN_UPDATE_ANY_JOB = 'ADMIN_UPDATE_ANY_JOB',
  CONTRIBUTOR_UPDATE_OWN_JOB = 'CONTRIBUTOR_UPDATE_OWN_JOB',
  /**
//    * @ArticleModule
//    */
//   ADMIN_CREATE_ANY_ARTICLE = 'ADMIN_CREATE_ANY_ARTICLE',
//   ADMIN_READ_ANY_ARTICLE = 'ADMIN_READ_ANY_ARTICLE',
//   ADMIN_DELETE_ANY_ARTICLE = 'ADMIN_DELETE_ANY_ARTICLE',
//   USER_CREATE_ANY_ARTICLE = 'USER_CREATE_ANY_ARTICLE',
//   USER_READ_ANY_ARTICLE = 'USER_READ_ANY_ARTICLE',
//   USER_UPDATE_OWN_ARTICLE = 'USER_UPDATE_OWN_ARTICLE',
//   USER_DELETE_OWN_ARTICLE = 'USER_DELETE_OWN_ARTICLE',
//   CONTRIBUTOR_CREATE_ANY_ARTICLE = 'CONTRIBUTOR_CREATE_ANY_ARTICLE',
//   CONTRIBUTOR_READ_ANY_ARTICLE = 'CONTRIBUTOR_READ_ANY_ARTICLE',
//   CONTRIBUTOR_UPDATE_OWN_ARTICLE = 'CONTRIBUTOR_UPDATE_OWN_ARTICLE',
//   CONTRIBUTOR_DELETE_OWN_ARTICLE = 'CONTRIBUTOR_DELETE_OWN_ARTICLE',
}

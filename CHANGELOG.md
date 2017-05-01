## OneMedia Dashboard Change Log

All notable changes to this project will be documented in this file.

### [0.9.5]

- Redux implementation in New Campaign Flow.
- Enhancements to Site Analytics and Campaign Dashboards.
- Bug/Issue fixes for Campaign Dashboard, Site Analytics and New Campaign. 
- Hyperlocal functionality added for New Campaign. 
- Campaign Budget and Schedule excel upload flow. 
- Pascal case component names - refactoring.
- Google Analytics Added for SPA. Note this is for start and each interaction analytics will be available in the next releases.
- Add multiple creatives for same dimension feature. 
- Creatives Screen. - Remove enabled for creatives. Preview ad can be done now. 
- Forgot password flow for the user. 
- CTT/VTT values in the Campaign Dashboard. 

### [0.9.1]

- Site Analytics Bug fixes.
- Campaign Dashboard Bug fixes.
- Edit Button disable for non onedigitalad users. 
- Query changes for Campaign Performance.
- Removed the nonstandard ui elements and uniform elements put.
- Add ability to run psi tools in localhost from command line.
- Dummy mode for API - for dev environment.
- Creative drop zone changes - align to current design. 
- Introduced view thru and click thru transactions stats in Today's stats - Campaign Dashboard.
- Citywise data issues resolved.
- Fixes for Today's stats metrics - 1. Yesterday total for Linear Progress 2. Compare todays stats till the time hour.
- Download excel for campaign and start/stop campaign in Campaign Dashboard.
- Merged Tabs in Admin Home.
- Removed Tabs in Campaign Dashboard.

### [0.9.0]

- New Campaign Creation fixes
- The new UI Theme integration. 
- New colors scheme applied.
- Campaign Dashboard UI
- Campaign Dashboard API Integration with Backend 
- Integration with Campaign realtime db and reports db. 
- Site Analytics UI
- Site Analytics API integration with Backend.
- Bug fixes 
- New Campaign - Target and Budget and Schedule screen fixes.
- New Test cases added on client and server side. 

### [0.8.0]

- Major changes in UI due to Material UI 0.15.0.beta release
- Edit Campaign functionality bug fixes
- Copy Campaign functionality bug fixes
- Complete create functionality working.
- Excel Upload option for Budget and Schedule 
- Default state of campaign to 'Pending'
- Login View changes
- Left menu bar label changes
- New Stepper Implementation
- Location and Target error fixes. for e.g. same city allowed to be added.
- Tags and Location search chip component.
- Minor Bug fixes.


### [0.7.0]

- Edit campaign
- Upload Creative error resolved.
- Basic Alignment for Stepper - margin all sides
- add .stylelintrc to make sublime text work with stylelint rules
- Campaign Dashboard - Dashboard screen initial layout with static data.
- Admin Dashboard link working Impressions graph is now expandable
- align graphs vertically
- Copy Campaign from Existing Campaign functionality
- Added aws credentials for image upload and region changes
- Minor bug fixes
- Campaign Dashboard API - dummy api
- Site analytics api - dummy  api 
- UI Skeleton ready for Site analytics. 
- Targeting screen changes 
- Removed / Refactored not required css and js files.


### [0.6.0]

- Campaign Save API
- Campaign Status changes UI Screen.
- Delete Campaign API - bugs fixed.
- Delete Campaign from Archive campaign list screen.
- Admin Home Bug fixes
- Added snack bar in Home. 
- Campaign Objective page.
- Static data apis.
- Integration of static data in UI components.
- Location Data api. Search the keyword in location box. 
- Location Screen Component - New section added
- Location chip component for keyword selected. 
- Budget & Schedule Screen Component - New section added. 
- Target Screen Component
- Windows tile icon 
- Stepper Icon changes
- Horizontal Stepper implementation. 
- Review screen - Basic functionality.
- Creatives Screen - Upload creatives functionality
- Creative upload to the server backend. 
- Upload to S3 and save the campaign with all the parameters. 
- Bug Fix for Target Reach Style.


### [0.4.0]
 - Added Static data api - to get brand_category 
 - new Campaigns objective and target page
 - Target Reach Section and animation
 - Admin Home Changes and alignment.
 - Layout color and theme changes
 - Fixed server rendering bugfix - #120
 - Save Draft and Save Campaign functionality.
 - Save Status API and check for correct update status on server side. 
 - Delete campaign API.
 - Added server side access logs. 
 - Enabled compression on the server side. 
 - Reach api Integration
 - Bug resolved for campaign status 
 - Added correct response status instruction and reduce the warning.
 - Added basic firefox integration tests for local & heroku
 - Make local integration testing working
 - Initialize integration tests
 - Added files via upload
 - Linting errors Resolved on Client side.
 - Wait for 2 sec b4 taking screenshots
 - AppBar click fix
 - Changes to the theme - CSS
 - Change logo, alignment of home image for wide screen corrected
 - Campaign Objective tab changes
 - Snackbar issue fixed
 - Linting errors fixed
 - Added local browserstack testing
 - Running the tests with Browser stack - Fixed #31
 - Restructure test cases
 - Es6 test cases upgrade webdriverio driver fixes #35 and fixes #31

### [0.2.0]

 - Fixed #85
 - Admin home changes to reflect new api changes
 - fixed #83
 - header colors fixed
 - Add Local screenshots Aliginment changes
 - Fix linting errors
 - Set correct fonts
 - Layout changes for home page
 - Merge with RSK
 - Save API is available for campaign
 - Validation - register call bug fix
 - Campaign Model - removed the unique for Campaign
 - Removed lint errors
 - Server side validation on login and registration apis
 - Active Campaign listing api
 - Archive Campaign listing api
 - Campaign Save api - Currently not complete. Dummy API
 - On Registration - user level campaign and archive campaign api.
 - Stepper implementation
 - Sign in alignment
 - integrate mdl.io css
 - Home page layout changes font correction using mdlio layou\
 - turn on jscs checks to catch errors Note: Added the exceptions in .jscrc. Also seen the errors are ignored for eslint disabled comment.
 - server side renedring fix for chrome
 - delete unwanted files this closes #76
 - campaign status bar changes
 - snackbar implimentation
 - resolves #78
 - forgot password changes
 - erroe text for login failure

### [0.1.0][unreleased]

- Add `CHANGELOG.md` file with a list of notable changes to this project
- Create Project Structure Test case framewrok finalization
- Intialize with RSK Kit
- Setup CI server
- Setup linting errors enforcement
- Login Flow completed
- Navigation Flow Finalization
- BackEnd API structure in place
- Wiki, docs and release process set
- Added Favicon Launcher Icon
- Jest Mocha Testing




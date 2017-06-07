# MWF Changelog
## Release Notes v1.6.0
### New
- Task # 7136933: Added additional scenarios for Video component, including closed captioning, quality, and more info.
- Task # 7219906: Added support for transparent Universal Header when in use with a hero
- Task # 7349304: Added localization for partner CSS.
- Task # 7612446: Added z-index across all components via new z-index-ramp for consistency.
- Task # 7639471: Added schema for feature channel module.
- Task # 7680417: Added support for bn-bd lang-locale.
- Task # 7555137: Added option for product placements to have default images with image error fallbacks.
- Task # 7560151: Added Media gallery option for Carousel component.
- Task # 7663932: Added additional content-type for product placement to illustrate the rectangular size.
- Task # 7762315: Added animations for dropdown and sub-menus.
- Task # 7762335: Added f-flip class to Menu item to allow js to flip position when reaching window bounds.

### Changed
- Task # 7157441: Updated JSON schema definition descriptions.
- Task # 7160041: Deprecated Alert, Back-to-top components and completed conversion to module.
- Task # 7190305: Updated Feature to switch layout to center layout.
- Task # 7396885: Updated read me and package to include revised instructions for node package consumption.
- Task # 7529759: Updated Subheading to include "p" tags and "h" tags.
- Task # 7530522: Changed typography color in Universal header. Added all branded examples. Added CTA and link examples.
- Task # 7559770: Standardized partner layout templates.
- Task # 7559810: DevToolbar updated to work with partner stylesheet.
- Task # 7579668: Updated "Code and preview" example names on Modx.
- Task # 7616725: Added left/right padding to modules and updated grid padding to improve content grid.
- Task # 7690437: Moved JavaScript for modules to live within the modules template folder.
- Task # 7719823: Updates baseline heading to Refine menu component in Refinements module.
- Task # 7750457: Updated schema for Product Placement to include artist.
- Task # 7763827: Updated Multi-Column module to include example of 5 column layout.
- Task # 7763950: Updated Label component to include code example class c-label.
- Task # 7774022: Moved JavaScript for components into their respective template folders.
- Task # 7775816: Removed all instances of anchors and replaced with buttons when they are opening submenus in Universal header.
- Task # 7813677: Removed bottom padding on Product placement module and updated top padding.
- Task # 7819577: Updated default margin for Featured collection module.
- Task # 7885907: Update staging tasks to match updated file structure for code examples.

### Fixed
- Bug # 7667952: Fixed an issue with Select Menu to allow href links to work properly.
- Bug # 7691267: Fixed issues with Feature Channel module in different viewports.
- Bug # 7761636: Fixed a bug where Menu item did not correctly wrap text.
- Bug # 7762762: Fixed a bug with height and text alignment defects with Link-navigation module.
- Bug # 7784135: Fixed issue with nested Mosaic modules and unnecessary data-grid attribute.
- Bug # 7815343: Fixed issue with variable height of Hyperlink Group module within the context of Hyperlink Group Content Placement module
- Bug # 7818545: Fixed image paths for Social component.
- Bug # 7815343: Fixed issue with variable height of Hyperlink group module within the context of Hyperlink group Content placement module

### Reported Issues

### Pages

### Modules
- Task # 7560151: Added new Media gallery module.
- Task # 7154256: Added a new Page bar module.

# MWF Changelog
## Release Notes v1.5.0
### New
- Task # 7530295: Added static sample pages for testing and examples.
- Task # 7414214: Added behavior and positioning for back to top.
- Task # 7398869: Added a content placement option to the Link list module.
- Task # 7517065: Added secondary style to CTA. Added disabled state to all CTAs.
- Task # 7560266: Added functionality to allow Hero, Feature, and Content placements to have zero, one, or two CTAs.
- Task # 7560270: Added a persistence option to the Select menu component.
- Task # 7072687: Added constant border to Product Placement component image.
- Task # 7528091: Added the option to hide Flipper component from screen readers.
- Task # 7640066: Added light and dark theme styles for Menu and Select menu.
- Task # 7601769: Added reports for partners.
- Task # 7159386: Added a toggle in the Product placement module to show the 'see all' link if there are more items than shown in a Carousel.
- Task # 7433797: Added the ME component to Universal header.
- Task # 7679173: Add content for Hololens views.
- Task # 7160007: Added the site-wide notification via the Alert module class 'f-fixed'.
- Task # 7434074: Added Structured list component.

### Changed
- Task # 7562903: Feature improvement request when in iPad portrait view where gap between image and content.
- Task # 7554293: Moved Carousel flippers to the gutter of Product placement module in VP4 and above.
- Task # 6751832: DevToolbar removed RTL button and added correct direction based on language selection.
- Task # 7520518: Replaced all "-example" class names with "-foo" as to clearly identify them as example selectors.
- Task # 7560030: Updates AMC responsive Drawer component to use Core JS versus custom development.
- Task # 7522783: Added mobile view for Universal header. Removed deprecated code.
- Task # 7443421: Updated inconsistencies in the Universal header to support either anchors or buttons for dropdowns.
- Task # 7433835: Added the ability for the Universal header to support either anchors or buttons for dropdowns.
- Task # 7720411: Added CTA back Universal header.
- Task # 7710998: Renamed Link list to Hyperlink group and placed Hyperlink group for Content placement in a 3 column and 9 column grid respectively.

### Fixed
- Bug # 7196417: Fixed a bug where the grid was applied to supplemental nav in the examples.
- Bug # 7603042: Fixed a bug where Select button had the wrong styling for the dark theme and disabled states.
- Bug # 7580177: Fixed a bug with hover state on pagination component; remove :hover from current page selected in pagination.
- Bug # 7614255: Fixed issue with caniuse data update that revised baseline of CSS files in reports.
- Bug # 7600933: Fixed a bug with Video in Content placements where Videos were overlapping.
- Bug # 7591190: Fixed a bug where table schema was mismatched with json data.
- Bug # 7365286: Fixed issue with menus where clicking off of the menu did not close the dropdown.
- Bug # 7701226: Fixed issue with Media module getting default top padding.

### Reported Issues
- Reported by: @vijayr : Bug # 7562903: When in iPad portrait view Feature component has extra gap between image and text.
- Reported by: @chwei : Bug # 7667952: Select menu anchor href's are not firing thus preventing navigation.

### Pages
- Task # 7279385, 7279392, 7279399, 7279404, 7279408, 7279414: Added MSN gallery page.
- Task # 7522783: Added six example pages for Universal header with the Hero component.
- Task # 7400478: Added interstitial checkout page for store.

### Modules
- Task # 7159420: Added new option of 3-up to content placement and expanded lines of text allowed from 2 to 4.
- Task # 7476412: Added the System requirements module.
- Task # 7159335: Added the Feature Channel module.
- Task # 7398938: Added the Age gate module for the store partner.
- Task # 7548380: Added new Media module.


# MWF Changelog
## Release Notes v1.4.0
### New
- Task # 7159998: Added a responsive option to the Drawer component.

### Changed

### Fixed
- Bug # 7512951: Fixed a bug where error and warning alert styles and glyph names were mapped incorrectly.
- Bug # 7047755: Fixed a bug correcting missing or incorrect letter spacing on CTA and Badge components.
- Bug # 7219346: Fixed a bug where multiple CTAs were not displayed correctly when grouped together in the Feature component.
- Bug # 7307248: Fixed a bug that caused List navigation component to extend outside the document body on mobile.
- Bug # 7395901: Fixed a bug where Pivot items would collapse on top of one another.
- Bug # 7401968: Fixed a bug where Pivot header was aligned out of bounds.
- Bug # 7432593: Fixed a bug where duplicate examples were shown for Select menu component.
- Bug # 7459824: Fixed a bug where Pivot sections would be hidden when clicking on the Pivot header.
- Bug # 7472455: Fixed a bug where the CTAs were colliding.
- Bug # 7472592: Fixed a bug where the CTA was being truncated too early in Content placement.
- Bug # 7472985: Fixed a bug where the CTA did not have a themed focus state.
- Bug # 7473862: Fixed a bug where the Action triggers in Alert where shown in the wrong order.
- Bug # 7492065: Fixed a bug where Flyout was incorrectly position on scroll and did not allow child elements within the launching element.
- Bug # 7513070: Fixed a bug where the CTAs were colliding in a Hero.
- Bug # 7472619: Fixed a bug where Product placement items in Carousel had poorly positioned focus rectangles.

### Reported Issues

### Pages

### Modules
- Task # 7135532: Added Alert module (Alert component will be deprecated in a future release).
- Task # 7158892: Added ratings and reviews module.
- Task # 7159350: Added the Bi-product placement module for placing two carousels in a single row.
- Task # 7159359: Added the AMC Product detail overview module consisting of product detail gallery and product detail information.
- Task # 7188569: Added the Content rich block module examples to include List component.
- Task # 7398758: Added the AMC placement module consisting of a default and hyperlink option.
- Task # 7398844: Added three new patterns to Mosaic, including usage of the link list module.
- Task # 7418702: Added a Multi column module which can incorporate list items and various content components.
- Task # 7448628: Added code examples for partners, includes page, module and component examples.
- Task # 7477398: Added the AMC Metatext info module.
- Task # 7159376: Added Additional Information module.


# MWF Changelog
## Release Notes v1.3.0
### New
- Task # 7180188: Added code example section in replace of code pen.
- Task # 7094616: Updated robots and humans files with latest contributors.
- Task # 7094673: Added a new developer page for MWF Spacing. Updated overview page with class names.
- Task # 7050053: Set up tasks to quickly create initial set up for new page template, modules and components.
- Task # 7010194: Added 2 new font regions (Armenian & Georgian) and 43 more locales.
- Task # 7190400: Added opacity mask options 10, 20, 40, 60, 80, 100 to Mosaic.
- Task # 7190390: Added Pattern 8, a single row with a medium A, medium B, and medium B layout to Mosaic.
- Task # 7202286: Fix documentation for modules for better consistency & readability.
- Task # 7240338: Adding report pages for modules and components to help partners track changes in MWF.
- Task # 7213519: Added vertical option for In-page navigation.
- Task # 7190324: Added two options to Text-field and Password that allow the field to be small and to flex to the parent container.
- Task # 7303676: Added two additional glyphs for warning and information to the alert component to show differing alert states.
- Task # 7258211: Added the JavaScript to close alerts.
- Task # 6645320: Added track list placement.
- Task # 7345945: Added option to product placement for TV shows and movies.
- Task # 7333123: Added large option to product placement.
- Task # 6863346: Added a new developer page for Search hub main page.
- Task # 7071985: Renamed left and right flippers to previous and next.
- Task # 7135033: Add callbacks to select menu and combo components.

### Changed
- Bug # 7210803: Moved isolated pieces of Universal Header to their own partial files.
- Bug # 7210803: Integrated auto-suggest into Universal Header search component.

### Fixed
- Bug # 7187284: Fixed a bug where Pivot was not working properly on Mac running FF 45.0.2.
- Bug # 7184087: Fixed a bug where Dialog is incorrectly positioned on mobile states.
- Bug # 7184530: Fixed a bug where disabled Rating states where the wrong opacity.
- Bug # 7291059: Fixed a bug where SASS was failing to compile when variables were defined within the scope of an if or if/else statement.
- Bug # 7292802: Fixed a bug where CTA and Badge components content was not all caps and should be in most localized languages.
- Bug # 6829642: Fixed a bug where Checkbox border is misaligned with the background.
- Bug # 6847289: Fixed a bug where Checkbox is misaligned in groups when long text is wrapped.
- Bug # 6829710: Fixed a bug where Checkbox mark is misaligned in groups when long text is wrapped.
- Bug # 7242721: Fixed a bug where CTA descenders were getting clipped.
- Bug # 7202729: Fixed a bug where CTA was getting clipped under certain scenarios.
- Bug # 7213199: Fixed a bug where CTA content was not shown in proper casing of all caps.

### Reported Issues
- Reported by: @bbrassell : Bug # 7184087: Dialog Bug on popup at 539 px wide screen in google chrome.
- Reported by: @brphelps, @chwei : Bug # 7183984: Complete the JavaScript story for SPA.
- Reported by: @arrayknight : Bug # 7185271: Content toggle JavaScript needs enhancements.
- Reported by: @kelly : Bug # 7187284: Pivot not working in FF on Mac.
- Reported by: @bbrassell : Bug # 7202737: Textarea bug where initial focus state started at at least 2 tab stops in rather than the top left corner.
- Reported by: @menzer : Task # 7365286: Menu type components should collapse on clicking outside of component.
- Reported by: @bbrassell : Bug # 7395901: Pivot item collapses into one another on mac safari.
- Reported by: @bbrassell : Bug # 7401968: Pivot header floats outside the bounds of the pivot section.

### Pages
- Task # 7159153, 7159159, 7159164, 7159163, 7159157 Added MSN article reader page.

### Modules
- Task # 5803299: Added refinement module consisting of refine menu, choice summary, heading, product placements and pagination components.
- Task # 6542316: Added a new video module.
- Task # 7207874: Added a new link list module.
- Task # 7190299: Added Rich heading module to display a heading with an image or logo paired with a small amount of descriptive text.
- Task # 7050121: Added compare chart module.
- Task # 7311139: Added a new search help module.
- Task # 7311132: Added a new item lists module.


# MWF Changelog
## Release Notes v1.2.0
### New
- Added the option for Price components to have text before and after.
- Added new option for Rating. Now supports a medium sized (f-individual) rating.
- Added the Feature module.
- Added the Content placement module.
- Added the Product placement module.
- Added the Link navigation module.
- Added the In-page navigation module.
- Added functionality to the Carousel component to allow images only.
- Added functionality to the Image component to be picture and accept an image for each breakpoint.
- Added the Mosaic module.
- Added the option for artist context type to Product placement component.
- Added Age rating component to provide concise and objective information about the age appropriateness of content in a video game, app, and/or media element.
- Added the Refine menu module.
- Added the Supplemental navigation module.
- Video player: Used to serve audio-visual content to a webpage to make it more engaging.
- Added social component to share and follow any number of social media networks.
- Added the Banner module which is a combination of a heading, sub-heading, images, and/or call-to-action in a meaningful container.
- Added the Table module.
- Added lean option to List component to remove internal padding between rows.
- Added the ability to use looping HTML 5 video in place of images in Heroes, Features, and Placements.
- Added no script design experience for those without JavaScript or without it enabled.
- Added additional background color options for Mosaic Placements.

### Changed
- Changed Social component (non-breaking) changes to add additional social button styles that have improved compatibility and accessibility over the previous network supplied components.
- Bundled JavaScript dependencies into single referenced mwf-main.js including minification for performance gains.
- Changed Badge styling to include 4px padding below the badge for all Product and Content Placements.
- Changed the deployment for CSS to include both region and lang-locale to CDN.

### Fixed
- Bug # 6516423: Fixed a bug where link navigation was misaligned in mobile views.
- Bug # 6868410: Fixed a bug where numeric data in tables should be right aligned.
- Bug # 6992200: Fixed a bug where in RTL the content was not switching appropriately.
- Bug # 7076583: Removed CSS uppercase text-transform to stop word meaning changes when localized.
- Bug # 7094575: Fixed a bug where uncaught reference error on JavaScript export was not defined on indexOf and bind polyfils.
- Bug # 7104840: Fixed a bug where the image was not correctly centered on viewport 2 and 3.
- Bug # 7106370: Fixed a bug where mosaic was not to scale when image and content were too small.
- Bug # 7108573: Fixed a bug where layout was incorrect for internet explorer 9.
- Bug # 7124034: Fixed a bug on carousel where the image was not correctly centered.
- Bug # 7134423: Fixed a bug where price has empty spans before and after the text.
- Bug # 7134423: Fixed a bug where price has empty spans before and after the text.


# MWF Changelog
## Release Notes v1.1.0
### New
- Added the File component.
- Added the Combo component.
- Compare chart module: A chart of organized images, paragraphs, lists, titles, and/or descriptions. Used to easily consume and compare information between items.
- Added the option for Select Menu to have a border.
- Added Universal Header and Universal Footer components to be included in packaged CSS for production.
- Added the option for images to be round.
- Added the option for select buttons component to have color swatches instead of text.
- Added responsive data-grid padding. This will resize the spacing between grid columns between viewports.

### Changed
- Removed DEPRECATED classes for all margin's and padding's. .m-r-\*, .m-b-\*, .m-l-\*, .m-\*, .p-v-\*, .p-h-\*, .p-t-\*, .p-r-\*, .p-b-\*, .p-l-\*, .p-\* including all spacers -xxl, -xl, -lg, -md, -sm, -xs, -xxs, -xxxs, -n.  Components contain their own padding/margin adjustments based on their position in relation to other components.  Otherwise, only the grid contains padding now pad-2x, pad-3x, pad-6x, and pad-12x"
- Changed CSS deployment from lang-local specific to region-specific on the CDN.
- Changed feature component to include content padding which previously didn't exist.
- Changed Mosaic placements to allow for heading only, sub-heading only, call-to-action only, or picture only.
- Removed source maps from inclusion when packaging CSS for production as it was bloating our CSS file unnecessarily.

### Fixed
- Bug # 6988517: Fixed a bug where media query range for x-visible-breakpoint classes was one size too small across viewports.
- Bug # 6988612: Fixed a bug where pivot content would disappear when pivot item was clicked.
- Bug # 6982467: Fixed a bug where dialogs could not be opened by more than one button or by anchor tags specifically c-call-to-action component.
- Bug # 7030329: Fixed a bug where focus state was being set incorrectly.
- Bug # 7029059: Fixed a bug where indeterminate progress bars did not have correct vertical height of 20px applied.
- Bug # 6717735: Fixed a bug where call to action had inconsistent vertical alignment of the glyph across browsers.
- Bug # 6846651: Fixed a bug where product placements displayed the currency symbol in an incorrect position.
- Bug # 6869904: Fixed a bug where album art was not centering when Hero layout was centered.
- Bug # 6870103: Fixed a bug where Date-time picker was styled incorrectly with list bullets.
- Bug # 7004224: Fixed a bug where Content-toggle was opening and closing when paragraph text was clicked.
- Bug # 7034049: Fixed a bug where fly-out position was broken on page resize events.

## Release Notes v1.0.0
- Officially released MWF v1 to public on http://www.getmwf.com

import React, { Component, PropTypes } from 'react';

class Icon extends Component {

  render() {
    const {name} = this.props;
    return (
      <svg className="icon">
        <use xlinkHref={`./dist/icons.svg#icon-svg_${name}`} />
      </svg>
    );
  }
}



Icon.propTypes = {
  name: PropTypes.string.isRequired
};

export default Icon;


/*
 Tilgjengelige ikoner:

 https://radioarkiv-dev.nrk.no/vendor/origo/styleguide/#icons

 action-cl-48px
 action
 alert
 arrow-back
 arrow-breadcrumb
 arrow-down
 arrow-left-cl-40px
 arrow-left
 arrow-link
 arrow-right-cl-40px
 arrow-right
 arrow-skinny-left
 arrow-skinny-right
 arrow-skinny-small-left
 arrow-skinny-small-right
 arrow-up
 calendar
 changelog
 checkbox-on
 checkbox-partial
 checkbox
 checkmark-plus
 checkmark
 clip-partial
 clip
 comment
 conflict
 copy-to-clipboard
 copy
 copyright-small
 copyright
 crop
 cut-segment
 cut
 destination-small
 destination
 disconnected
 download
 dub
 edit-handle-left
 edit-handle-right
 edit-small
 edit-title
 edit
 eksport
 event
 export-initial
 external-link
 fail-20px
 fail-50px
 fail
 favorite-off
 favorite-on
 filter
 forbidden
 hamburger
 hide-details
 hide
 image
 import
 in
 info
 link
 list-add
 list
 locked
 maximize
 minus-c
 minus-cl-30px
 minus-cl
 minus
 mobile
 more
 move-vertical
 move
 new-cl
 new
 newsagency
 notification
 object-group
 ok-20px
 ok-50px
 ok-c
 ok
 out
 pause-40px
 pause-48px
 pause-c
 pause-cl-30px
 pause-cl
 pause
 play-40px
 play-48px
 play-c
 play-cl-30px
 play-cl
 play
 playback
 playhead
 plus-c
 plus-cl-30px
 plus-cl
 pluss
 popout
 potion
 premiere
 procam
 program-30px
 program-end
 program-start
 program
 progress-50px
 quantel
 radio-button-on
 radio-button
 radio-theatre-30px
 radio-theatre
 recital-30px
 recital
 reload
 replay-in
 replay-out
 replay
 search-big
 search
 segment-dashed
 segment-music
 segment-other
 segment
 segments-show
 settings
 share
 show-details
 show-down
 show-up
 show
 skip-back
 skip-forward
 sound-low
 sound-off
 sound
 status
 tag
 trim-left
 trim-right
 undo
 unknown-type-30px
 unlocked
 unmaximize
 user-30px
 user-40px
 user-small
 user
 usergroup
 video-object-dotted
 video-object-solid
 warning
 waveform-edit
 waveform
 x-c
 x-cl
 x-small
 x
 zoom-in
 zoom-out

 */

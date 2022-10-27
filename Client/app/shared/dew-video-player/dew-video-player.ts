import { Component, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'dew-video-player',
    template: ` <div class="video-player-wrapper">
    <vg-player (onPlayerReady)="invokePlaylist($event)">
        <vg-overlay-play></vg-overlay-play>
        <vg-buffering></vg-buffering>

        <vg-scrub-bar [vgSlider]="true">
            <vg-scrub-bar-current-time></vg-scrub-bar-current-time>
            <vg-scrub-bar-buffering-time></vg-scrub-bar-buffering-time>
        </vg-scrub-bar>

        <vg-controls>
            <vg-play-pause></vg-play-pause>
            <vg-playback-button></vg-playback-button>
            <vg-time-display vgProperty="current" vgFormat="mm:ss"></vg-time-display>
            <vg-scrub-bar style="pointer-events: none;"></vg-scrub-bar>
            <vg-time-display vgProperty="left" vgFormat="mm:ss"></vg-time-display>
            <vg-time-display vgProperty="total" vgFormat="mm:ss"></vg-time-display>
            <vg-track-selector></vg-track-selector>
            <vg-mute></vg-mute>
            <vg-volume></vg-volume>

            <vg-fullscreen></vg-fullscreen>
        </vg-controls>

        <video #media [vgMedia]="media" [src]="currentVid.src" preload="auto" crossorigin>
        </video>
    </vg-player>

    <ul class="video-list">
        <li *ngFor="let video of videoIPlaylist; let i = index" (click)="startPlayer(video, i)"
            [class.selected]="video === currentVid">
            {{ video.name }}
        </li>
    </ul>

</div>`
})

export class dewVideoPlayer {

    @Input() videoIPlaylist: any = [];
    @Input() activeIndex: any;
    @Input() currentVid: any;

    data;

    ngOnInit() {

    }

    invokePlaylist(data) {
        this.data = data;
        this.data.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.evokeVideo.bind(this));
        this.data.getDefaultMedia().subscriptions.ended.subscribe(this.nextVdo.bind(this));
    }

    nextVdo() {
        this.activeIndex++;

        if (this.activeIndex === this.videoIPlaylist.length) {
            this.activeIndex = 0;
        }

        this.currentVid = this.videoIPlaylist[this.activeIndex];
    }

    evokeVideo() {
        this.data.play();
    }

    startPlayer(item, index: number) {
        this.activeIndex = index;
        this.currentVid = item;
    }
}
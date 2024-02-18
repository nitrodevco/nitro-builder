export interface ILinkEventTracker
{
    linkReceived(link: string): void;
    eventUrlPrefix: string;
}

export class LinkEventTracker
{
    private _linkTrackers: ILinkEventTracker[] = [];

    public addLinkEventTracker(tracker: ILinkEventTracker): void
    {
        if (this._linkTrackers.indexOf(tracker) >= 0) return;

        this._linkTrackers.push(tracker);
    }

    public removeLinkEventTracker(tracker: ILinkEventTracker): void
    {
        const index = this._linkTrackers.indexOf(tracker);

        if (index === -1) return;

        this._linkTrackers.splice(index, 1);
    }

    public createLinkEvent(link: string): void
    {
        if (!link || (link === '')) return;

        for (const tracker of this._linkTrackers)
        {
            if (!tracker) continue;

            const prefix = tracker.eventUrlPrefix;

            if (prefix.length > 0)
            {
                if (link.substr(0, prefix.length) === prefix) tracker.linkReceived(link);
            }
            else
            {
                tracker.linkReceived(link);
            }
        }
    }
}

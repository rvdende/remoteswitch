export class MomentAlt {
    date: Date;
    constructor(input: Date | string) {
        if (input == undefined) throw Error('Expected a date')
        this.date = new Date(input);
    }

    fromNow() {
        if (this.date == undefined) { return "never" }
        const seconds = Math.floor((new Date().getTime() - this.date.getTime()) / 1000);

        let interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + "y ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + "m ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + "d ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + "h ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + "m ago";
        }

        if ((seconds >= 60) && (seconds < 120)) {
            return "a minute ago"
        }

        if (seconds > 5) {
            return Math.floor(seconds) + " seconds ago";
        }

        return "just now";
    }

    timeDelta() {
        const seconds = Math.floor((new Date().getTime() - this.date.getTime()) / 1000);

        // const years = Math.floor(seconds / 31536000);
        // const months = Math.floor(seconds / 2592000);
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds / 60);

        let output = "";
        if (days >= 1) {
            output += days + "d "
        }

        if (hours >= 1) {
            output += this.pad((hours % 24), 2, "0") + ":"
        }

        if (minutes >= 1) {
            output += this.pad((minutes % 60), 2, "0") + ":"
        }

        output += this.pad((seconds % 60), 2, "0") + "s"

        return output + " ago";
    }

    pad(input: string | number, digits: number, padString: string) {
        let str = input + "";
        while (str.length < digits)
            str = padString + str;
        return str;
    }
}

export function moment(input: Date | string) {
    return new MomentAlt(input);
}
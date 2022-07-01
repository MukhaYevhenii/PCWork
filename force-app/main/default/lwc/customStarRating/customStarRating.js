import { LightningElement, api, track } from 'lwc';
export default class StarRating extends LightningElement {

    @api labelStyle='';
    @track stars;
    @track componentClass = '';
    @track color = '#999';

    _maximumNumberOfStars = 15;
    _labelText = '';
    _originalLabelText = '';
    _labelPosition = 'left';
    _labelVisible = true;
    _showHalfStars = false;
    _halfStarVisible = false;
    _disabled = false;
    _readOnly = false;
    _rating = 0;
    _staticColor = null;
    _colorDefault = '#999';
    _colorOk = '#f6da3f';
    _colorPositive = '#029bdb';
    _colorNegative = '#f03c56';
    _direction = '';
    _ratingAsInteger = 0;
    _numberOfStars = 5;
    _spaceBetween = 'small';
    _size = 'medium';
    _labelRegex = /\${rating}/gi;


    get size() {
        return this._size;
    }
    @api
    set size(value) {
        this._size = value;
        this.componentClass = this.getComponentClassNames();
    }

    get direction() {
        return this._direction;
    }

    @api
    set direction(value) {
        this._direction = value || undefined;
        this.componentClass = this.getComponentClassNames();
    }

    get labelText() {
        return this.parseLabelText();
    }

    @api
    set labelText(value) {
        this._originalLabelText = value || "";
    }

    parseLabelText() {
        this._labelText = this._originalLabelText.replace(this._labelRegex, this.rating);
        return this._labelText;
    }

    get labelPosition() {
        return this._labelPosition;
    }

    @api
    set labelPosition(value) {
        this._labelPosition = value;
        this.componentClass = this.getComponentClassNames();
    }

    get labelVisible() {
        return this._labelVisible;
    }

    get labelHidden() {
        return this._labelVisible;
    }

    @api
    set labelHidden(value) {
        this._labelVisible = !value;
        this.componentClass = this.getComponentClassNames();
    }

    get colorDefault() {
        return this._colorDefault;
    }

    @api
    set colorDefault(value) {
        this._colorDefault = value;
        this.color = this.getColor(this.rating);
    }

    get colorPositive() {
        return this._colorPositive;
    }

    @api
    set colorPositive(value) {
        this._colorPositive = value;
        this.color = this.getColor(this.rating);
    }

    get colorNegative() {
        return this._colorNegative;
    }

    @api
    set colorNegative(value) {
        this._colorNegative = value;
        this.color = this.getColor(this.rating);
    }

    get colorOk() {
        return this._colorOk;
    }

    @api
    set colorOk(value) {
        this._colorOk = value;
        this.color = this.getColor(this.rating);
    }

    get maximumNumberOfStars() {
        return this._maximumNumberOfStars;
    }

    get numberOfStars() {
        return this._numberOfStars;
    }

    @api
    set numberOfStars(value) {
        this._numberOfStars =
            value && value >= this.maximumNumberOfStars
                ? this.maximumNumberOfStars
                : value;
        this.componentClass = this.getComponentClassNames();
        this.stars = this.getStarsArray();
    }

    @api
    set rating(value) {
        this._ratingAsInteger = parseInt(value, 10);
        this._rating = Number(value);
        this.setRating(this._rating);
        this.componentClass = this.getComponentClassNames();
    }
    get rating() {
        return this._rating;
    }

    get spaceBetween() {
        return 'space-' + this._spaceBetween;
    }
    @api
    set spaceBetween(value) {
        this._spaceBetween = value;
        this.componentClass = this.getComponentClassNames();
    }

    set halfStarVisible(value) {
        this._halfStarVisible = value;
    }
    get halfStarVisible() {
        return this._halfStarVisible;
    }

    get staticColor() {
        return this._staticColor;
    }

    @api
    set staticColor(value) {
        this._staticColor = value;
        this.color = this.getColor(this.rating);
    }

    get disabled() {
        return this._disabled;
    }

    @api
    set disabled(value) {
        this._disabled = !!value;
        this.componentClass = this.getComponentClassNames();
    }

    get readOnly() {
        return this._readOnly;
    }
    
    get readOnlyStar(){
        return this._readOnly;
    }

    @api
    set readOnlyStar(value) {
        this._readOnly = !!value;
        this.componentClass = this.getComponentClassNames();
    }

    get showHalfStars() {
        return this._showHalfStars;
    }

    @api
    set showHalfStars(value) {
        this._showHalfStars = !!value;
        this.setHalfStarVisible();
        this.componentClass = this.getComponentClassNames();
    }

    connectedCallback() {
        this.step = 1;
        this.stars = this.getStarsArray();
        this.componentClass = this.getComponentClassNames();
        this.setColor();
    }

    getComponentClassNames() {
        const classNames = ['rating'];
        classNames.push(
            this.rating ? 'value-' + this._ratingAsInteger : 'value-0'
        );
        classNames.push(this.halfStarVisible ? 'half' : '');
        classNames.push(this.size);
        classNames.push(this.readOnly ? 'read-only' : '');
        classNames.push(this.disabled ? 'disabled' : '');
        classNames.push(
            this.labelVisible ? 'label-' + this.labelPosition : 'label-hidden'
        );
        classNames.push(this.direction ? 'direction-' + this.direction : '');
        classNames.push(this.spaceBetween);

        return classNames.join(' ');
    }

    getStarsArray(numOfStars) {
        if (!numOfStars) {
            numOfStars = this.numberOfStars;
        }

        let stars = [];
        let rating = this.rating;
        for (let i = 0; i < numOfStars; i++) {
            let star = {
                id: 'star-' + i,
                value: i + 1,
                class:"star value-empty"
            };
            if(i < rating){
                star.class = "star value-filled";
            }
            if(this.halfStarVisible && i === this._ratingAsInteger){
                star.class = "star value-half";
            }
            stars.push(star);
        }
        return stars;
    }

    onStarClicked(event) {
        if (!this.interactionPossible()) {
            return;
        }
        if (event && !event.target) {
            return;
        }
        let targetEl = event.target;
        let ratingValue = this.getStarRatingValue(targetEl);
        this.setRating(ratingValue);
    }

    getStarRatingValue(targetEl) {
        if (!targetEl) {
            return 0;
        }
        let starEl = targetEl.closest('div[data-rating]');
        if (!starEl) {
            return 0;
        }
        let ratingValue = this.getRatingValue(starEl);
        return ratingValue;
    }

    getRatingValue(starEl) {
        return starEl ? parseInt(starEl.getAttribute('data-rating'), 10) : 0;
    }

    setRating(value) {
        let newRating = 0;
        if (value >= 0 && value <= this.maximumNumberOfStars) {
            newRating = value;
        }

        if (value > this.maximumNumberOfStars) {
            newRating = this.numberOfStars;
        }
        this._rating = newRating;

        this._ratingAsInteger = parseInt(this.rating.toString(), 10);
        this.setHalfStarVisible();
        this._labelText = this._originalLabelText;
        this.stars = this.getStarsArray();
        this.setColor();

        this.dispatchEvent(
            new CustomEvent('ratingchange', {
                detail: {
                    rating: this.rating
                }
            })
        );
    }

    setColor() {
        const ratingValue = this.rating;
        this.color = this.getColor(
            ratingValue,
            this.numberOfStars,
            this.staticColor
        );
        this.componentClass = this.getComponentClassNames();
    }

    setHalfStarVisible() {
        if (this.showHalfStars) {
            this.halfStarVisible = this.getHalfStarVisible(this.rating);
        } else {
            this.halfStarVisible = false;
        }
    }

    getHalfStarVisible(rating) {
        return Math.abs(rating % 1) > 0;
    }

    interactionPossible() {
        return !this.readOnly && !this.disabled;
    }

    onKeyDown(event) {
        if (!this.interactionPossible()) {
            return;
        }

        const handlers = {
            Minus: () => this.decrement(),
            ArrowDown: () => this.decrement(),
            ArrowLeft: () => this.decrement(),

            Plus: () => this.increment(),
            ArrowRight: () => this.increment(),
            ArrowUp: () => this.increment(),

            Backspace: () => this.reset(),
            Delete: () => this.reset(),
            Digit0: () => this.reset()
        };

        const handleDigits = (eventCode) => {
            const dStr = 'Digit';
            const digit = parseInt(
                eventCode.substr(dStr.length, eventCode.length - 1),
                10
            );
            this._rating = digit;
            this.setRating(this.rating);
        };

        if (handlers[event.code] || this.isDigitKeyEventCode(event.code)) {
            if (this.isDigitKeyEventCode(event.code)) {
                handleDigits(event.code);
            } else {
                handlers[event.code]();
            }
            event.preventDefault();
            event.stopPropagation();
        }
    }

    isDigitKeyEventCode(eventCode) {
        return eventCode.indexOf('Digit') === 0;
    }

    increment() {
        const absDiff = Math.abs(this.rating % this.step);
        this._rating =
            this.rating + (absDiff > 0 ? this.step - absDiff : this.step);
        this.setRating(this.rating);
    }

    decrement() {
        const absDiff = Math.abs(this.rating % this.step);
        this._rating = this.rating - (absDiff > 0 ? absDiff : this.step);
        this.setRating(this.rating);
    }

    reset() {
        this._rating = 0;
        this.setRating(this.rating);
    }

    getColor(rating, numOfStars, staticColor) {
        rating = rating || 0;
        numOfStars = numOfStars || this.numberOfStars;
        staticColor = staticColor || this.staticColor;

        if (staticColor) {
            return staticColor;
        }

        let fractionSize = numOfStars / 3;

        let color = this.colorDefault;
        if (rating > 0) {
            color = this.colorNegative;
        }
        if (rating > fractionSize) {
            color = this.colorOk;
        }
        if (rating > fractionSize * 2) {
            color = this.colorPositive;
        }

        return color;
    }
}
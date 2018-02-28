Vue.component('paginatrix', {
    props: {
        data: {
            type: Object,
            default: function() {
                return {
                    current_page: 1,
                    last_page: 1,
                };
            },
        },
        limit: {
            type: Number,
            default: 10,
        },
        ulPaginationClasses: {
            type: Array,
            default: function() {
                return ['pagination'];
            }
        }
    },
    data: function () {
        return {
            next_page: 1,
            prev_page: 1,
        };
    },
    template:
    `<nav aria-label="Page navigation">
        <ul :class="ulPaginationClasses">
            <li>
                <slot name="prev-link">
                    <a role="button" class="page-link no-user-selection" aria-label="Previous"
                        @click.prevent="selectPage(prev_page)">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </slot>
            </li>
            <li v-for="n in getPages()">
                <slot name="number-link" :pageNum="n">
                    <a role="button" class="page-link no-user-selection" @click.prevent="selectPage(n)">{{ n }}</a>
                </slot>
            </li>
            <li>
                <slot name="next-link">
                    <a role="button" class="page-link no-user-selection" aria-label="Next"
                        @click.prevent="selectPage(next_page)" style="user-select: none;">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </slot>
            </li>
        </ul>
    </nav>`,

    methods: {
        selectPage: function(page) {
            if(page <= this.data.last_page && page > 0) {
                this.$emit('pagination-change-page', page);
            }
        },
        getPages: function() {
            if (this.limit < 0) {
                return 0;
            } else if (this.limit === 0) {
                return this.data.last_page;
            }

            // The number of pages that there should be before the current page
            var med = Math.floor((this.limit - 1) / 2);
             
            if(this.data.last_page - this.data.current_page <= med) {
                // In case there needs to be more pages before the current page to fill the limit
                med = this.limit - (this.data.last_page - this.data.current_page) - 1;
            }

            var pag = 0,
                pages = [];

            // The first page number that should be shown.
            // If there actually aren't ${med} pages before the current page:
            // start showing page links from "1"
            var pagNum = this.data.current_page - med <= 0 ? 1 : this.data.current_page - med;

            for(var i = pagNum; i < this.data.current_page; i++) {
                pages.push(i);
                pag++;
            }
            pages.push(this.data.current_page);
            // Add the page links that go after the current page.
            // Also makes sure that no page link after the last page is shown.
            for(var i = 1; i < this.limit - pag && this.data.current_page + i <= this.data.last_page; i++) {
                pages.push(this.data.current_page + i);
            }
            // Reassign the values for the previous page and the next page
            this.prev_page =
                this.data.current_page <= 1 ? 1 : this.data.current_page - 1;
            this.next_page =
                this.data.current_page >= this.data.last_page ? this.data.last_page : this.data.current_page + 1;

            return pages;
        }
    }
});

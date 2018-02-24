Vue.component('paginatrix', {
    props: {
        data: {
            type: Object,
            default: function() {
                return {
                    current_page: 1,
                    data: [],
                    from: 1,
                    last_page: 1,
                    next_page_url: null,
                    per_page: 10,
                    prev_page_url: null,
                    to: 1,
                    total: 0,
                };
            },
        },
        limit: {
            type: Number,
            default: 10,
        },
    },
    data: function () {
        return {
            next_page: 1,
            prev_page: 1,
        };
    },
    template:
    `<nav aria-label="Page navigation">
        <ul class="pagination">
            <li>
                <a role="button" class="page-link" aria-label="Previous"
                    @click.prevent="selectPage(prev_page)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li v-for="n in getPages()" :class="{ 'active': n == data.current_page }">
                <a role="button" class="page-link" @click.prevent="selectPage(n)">{{ n }}</a>
            </li>
            <li>
                <a role="button" class="page-link" aria-label="Next"
                    @click.prevent="selectPage(next_page)">
                    <span aria-hidden="true">&raquo;</span>
                </a>
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
            if (this.limit === -1) {
                return 0;
            }

            if (this.limit === 0) {
                return this.data.last_page;
            }

            var med = Math.floor((this.limit - 1) / 2);
             
            if(this.data.last_page - this.data.current_page <= med) {
                med = this.limit - (this.data.last_page - this.data.current_page) -1;
            }
            var pag = 0;

            var start = this.data.current_page - this.limit,
                end   = this.data.current_page + this.limit + 1,
                pages = [],
                index = this.data.current_page - med <= 0 ? 1 : this.data.current_page - med;

            for(var i = index; i < this.data.current_page; i++) {
                pages.push(i);
                pag ++;
            }
            pages.push(this.data.current_page);
            for(var i = 1; i < this.limit - pag && this.data.current_page + i <= this.data.last_page; i++) {
                pages.push(this.data.current_page + i);
            }
            this.prev_page =
                this.data.current_page <= 1 ? 1 : this.data.current_page - 1;
            this.next_page =
                this.data.current_page >= this.data.last_page ? this.data.last_page : this.data.current_page + 1;

            return pages;
        }
    }
});
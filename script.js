let timeout;
let active_book;

function notify(msg, color = 0, bgcolor = 0) {
    // This funtion modifies the content inside the message panel to notify the user about an event, Success or Failure

    clearTimeout(timeout)

    message.innerText = msg;

    if (color != 0) {
        message_pane.style.color = color;
    }

    if (bgcolor != 0) {
        message_pane.style.backgroundColor = bgcolor;
    }

    timeout = setTimeout(() => {
        message.innerText = '...';
        message_pane.style.color = 'rgb(117, 117, 117)';
        message_pane.style.backgroundColor = 'rgb(241, 241, 241)';
    }, 3000)



}

function cancel_add_book() {
    // Will execute if the cancel button in the add book section is pressed
    //this will clear all the entries of the form and notify.

    enter_name.value = '';
    enter_author.value = '';
    enter_page.value = '';
    enter_price.value = '';
    enter_type.value = '';
    notify('Cancelled Adding Books')
}

function add_book() {
    // this function will be called when the add button inside the add book section will be pressed
    // this function collects the information from the form and creates a new book object with the information in the local storage
    function validate(value) {
        if (value.replaceAll(' ', '') != '') {
            return true
        }
        return false
    }

    function month_name(n) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[n];
    }

    let n_index = '1'

    book_name = enter_name.value;
    book_author = enter_author.value;
    book_page = enter_page.value;
    book_price = enter_price.value;
    book_type = enter_type.value;

    if (localStorage.getItem('next_index') != null) {
        n_index = localStorage.getItem('next_index')

    }
    else {
        localStorage.setItem('next_index', n_index)
    }



    if (validate(book_name) && validate(book_author) && validate(book_page) && validate(book_price) && validate(book_type) && Number(book_page) < 10000 && Number(book_price) < 1000) {

        book = {
            'id': n_index,
            'name': book_name,
            'author': book_author,
            'page': book_page,
            'price': book_price,
            'type': book_type,
            'status': 'available',
            'date': (new Date().getDate() + 1) + ' ' + (month_name(new Date().getMonth()))
        }



        localStorage.setItem(n_index, JSON.stringify(book))
        n_index = String(Number(n_index) + 1)
        localStorage.setItem('next_index', n_index)

        enter_name.value = '';
        enter_author.value = '';
        enter_page.value = '';
        enter_price.value = '';
        enter_type.value = '';
        notify("Success : Book successfully added to the database", 'green', 'rgba(65, 255, 122, 0.44)')


        plot_books()


        setTimeout(() => {

            try {
                document.getElementById(Number(n_index) - 2).scrollIntoView();
            } catch (e) { }

        }, 100);

    }

    else {
        notify('Failed to add book : Please enter the details correctly', 'red', 'rgba(255, 0, 0, 0.28)')
    }
}

function add_10_books() {

    function month_name(n) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[n];
    }

    let n_index = '1'


    if (localStorage.getItem('next_index') != null) {
        n_index = localStorage.getItem('next_index')

    }
    else {
        localStorage.setItem('next_index', n_index)
    }


    book_name = 'Sample Book' + ' ' + n_index;
    book_author = 'Sample Author';
    book_page = '100';
    book_price = '9';
    book_type = 'Fictional';




    book = {
        'id': n_index,
        'name': book_name,
        'author': book_author,
        'page': book_page,
        'price': book_price,
        'type': book_type,
        'status': 'available',
        'date': (new Date().getDate() + 1) + ' ' + (month_name(new Date().getMonth()))
    }


    for (let i = 0; i < 10; i++) {

        localStorage.setItem(n_index, JSON.stringify(book))
        n_index = String(Number(n_index) + 1)
        localStorage.setItem('next_index', n_index)
        book.name = 'Sample Book' + ' ' + n_index;
        book.id = n_index;
    }

    notify("Success : 10 Sample Books were successfully added to the database", 'green', 'rgba(65, 255, 122, 0.44)')
    plot_books()

    setTimeout(() => {
        try {
            document.getElementById(Number(n_index) - 11).scrollIntoView();
        } catch (e) { }

    }, 100);


}

function sort_keys(arr) {



    new_arr = []
    for (x of arr) {
        if (x != 'next_index') {
            new_arr.push(Number(x))

        }
    }
    new_new_arr = []

    for (i of new_arr.sort(function (a, b) {
        return a - b;
    })
    ) {
        new_new_arr.push(String(i))
    }
    return new_new_arr

}

function plot_books(keys = Object.keys(localStorage)) {

    setTimeout(() => {




        books_pane.innerHTML = ''
        let newHTML = ''




        new_keys = sort_keys(keys)
        for (key of new_keys) {
            book_obj = JSON.parse(localStorage.getItem(key))

            if (book_obj.status != 'available') {
                bcolor = 'rgba(49, 49, 49, 0.3)';
                color = 'black'
            }
            else {
                bcolor = 'rgb(214, 255, 214)';
                color = 'green'
            }

            newHTML = newHTML +
                `
                <div class="book">
                        <span id="${key}" class = "id" style="width: 50px;text-align:center;">${key}</span>
                        <span style="width: 400px; font-weight: 700; opacity: 75%;">${book_obj.name}</span>
                        <span
                            style="width: 120px; color: ${color}; font-weight: 700; border-radius: 5px; background-color: ${bcolor}; text-align: center;">${book_obj.status}</span>
                            
                    </div>
                
                
                `



        }

        books_pane.innerHTML = newHTML;




        total_books.innerHTML = `${sort_keys(keys).length}/${Object.keys(localStorage).length - 1} books`

        add_click_listeners()



    }, 1);


}

function clear_library() {
    if (confirm('This action will DELETE all the books in the database. Do you still want to continue ?')) {
        localStorage.clear()
        localStorage.setItem('next_index', '1');
        plot_books()
        document.getElementById("status").innerText = '...';

        name_value.innerText = '...';
        author_value.innerText = '...';
        type_value.innerText = '...';
        name_value.innerText = '...';
        date_value.innerText = '...';
        id_value.innerText = '...';
        page_value.innerText = '...';
        price_value.innerText = '...';
        remove.value = '...';
        borrow_return.value = '...';
        notify("Success : The Library was cleared", 'green', 'rgba(65, 255, 122, 0.44)')
    }
}

function ret_func(id) {
    return function () {



        this_book = JSON.parse(localStorage.getItem(id));
        active_book = this_book;




        document.getElementById("status").innerText = this_book.status;



        name_value.innerText = this_book.name;
        author_value.innerText = this_book.author;
        type_value.innerText = this_book.type;
        name_value.innerText = this_book.name;
        date_value.innerText = this_book.date;
        id_value.innerText = this_book.id;
        page_value.innerText = this_book.page;
        price_value.innerText = '$' + this_book.price;

        remove.value = 'Remove'
        borrow_return.value = 'Borrow'

        document.getElementById("status").style.backgroundColor = 'rgba(200, 255, 195, 0.623)';
        document.getElementById("status").style.color = 'rgb(12, 145, 0)';


        if (this_book.status != 'available') {
            borrow_return.value = 'Return'
            document.getElementById("status").style.backgroundColor = 'rgba(177, 177, 177, 0.44)';
            document.getElementById("status").style.color = 'rgba(49, 49, 49, 1)';

        }

    }
}

function add_click_listeners() {

    ids = document.querySelectorAll('.book>.id')
    objs = document.querySelectorAll('.book')
    for (ind in document.querySelectorAll('.book')) {
        try {

            objs[ind].addEventListener('click', ret_func(ids[ind].innerText))

        }
        catch (err) {

        }


    }
}

function remove_active() {

    if (active_book != null) {

        let to_remove = active_book['id'];

        localStorage.removeItem(to_remove)
        plot_books()

        document.getElementById("status").innerText = '...';

        name_value.innerText = '...';
        author_value.innerText = '...';
        type_value.innerText = '...';
        name_value.innerText = '...';
        date_value.innerText = '...';
        id_value.innerText = '...';
        page_value.innerText = '...';
        price_value.innerText = '...';
        remove.value = '...';
        borrow_return.value = '...';
        notify(`Success : Book : '${active_book['name']}' was removed successfully`, 'green', 'rgba(65, 255, 122, 0.44)')


        active_book = null
    }
}

function borrow_return_active() {

    if (active_book != null) {



        if (this_book.status == 'available') {

            // JSON.parse(localStorage.getItem(active_book['id'])).status = 'rented'

            str = localStorage.getItem(active_book['id'])
            obj = JSON.parse(str)
            obj.status = 'rented';
            str2 = JSON.stringify(obj)

            localStorage[active_book['id']] = str2;



        }

        else {

            // JSON.parse(localStorage.getItem(active_book['id'])).status = 'available'

            str = localStorage.getItem(active_book['id'])
            obj = JSON.parse(str)
            obj.status = 'available';
            str2 = JSON.stringify(obj)

            localStorage[active_book['id']] = str2;

        }

        active_book = null;
        plot_books()

        document.getElementById("status").innerText = '...';

        name_value.innerText = '...';
        author_value.innerText = '...';
        type_value.innerText = '...';
        name_value.innerText = '...';
        date_value.innerText = '...';
        id_value.innerText = '...';
        page_value.innerText = '...';
        price_value.innerText = '...';
        remove.value = '...';

        notify(`Success : Book successfully ${borrow_return.value}ed`, 'green', 'rgba(65, 255, 122, 0.44)')

        borrow_return.value = '...';
    }

}

function clear_search() {
    search_input.value = '';
    plot_books()
}

function filter() {
    search_value = search_input.value.toLowerCase();
    if (search_value.replaceAll(' ', '') != '') {

        keys = sort_keys(Object.keys(localStorage))
        to_remove = []

        to_show = []

        for (x of keys) {
            book = JSON.parse(localStorage.getItem(x));

            if (book['name'].toLowerCase().includes(search_value) || book['id'].includes(search_value)) {
                to_show.push(x)
            }

        }

        plot_books(to_show)

    }
    else {
        plot_books()

    }
}

plot_books()

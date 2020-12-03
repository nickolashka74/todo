import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import PostStatusFilter from '../post-status-filter';
import PostList from '../post-list';
import PostAddForm from '../post-add-form';

import './app.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {label: 'Going to learn React', important: true, like: false, id: 1},
                {label: 'That is so good', like: false, id: 2},
                {label: 'I need a break...', like: false, id: 3}
            ],
            term: '',
            filter: 'all'
        };
        this.deleteItem = this.deleteItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.onToggleImportant = this.onToggleImportant.bind(this);
        this.onToggleLiked = this.onToggleLiked.bind(this);
        this.onUpdateSearch = this.onUpdateSearch.bind(this);
        this.onFilterSelect = this.onFilterSelect.bind(this);

        this.maxId = 4;
    }

    addItem(body) {
        const newItem = {
            label: body,
            important: false,
            id: this.maxId++
        }
        this.setState(({data}) => {
            const newArr = [...data, newItem];
            return {
                data: newArr
            }
        })
    }

    deleteItem(id) {
        this.setState(({data}) => {
            const newArr = data.filter(item => item.id !== id);
            return {
                data: newArr
            }
        })
    }

    onToggleImportant(id) {
        this.changeState(id, {isImpotant: true});
    }

    onToggleLiked(id) {
        this.changeState(id, {isLiked: true});
    }

    changeState(id, {isImpotant = false, isLiked = false}) {
        this.setState(({data}) => {
            const index = data.findIndex((item) => item.id === id);
            const oldItem = data[index];
            if (isImpotant) {
                oldItem.important = !oldItem.important;
            }
            if (isLiked) {
                oldItem.like = !oldItem.like;
            }
            const newItem = {...oldItem};
            return {
                data: [...data.slice(0, index), newItem, ...data.slice(index + 1)]
            }
        });
    }

    searchPost(items, term) {
        if(term === 0) {
            return items;
        }

        return items.filter(item => {
            return item.label.indexOf(term) > -1;
        })
    }

    filterPosts(items, filter) {
        if (filter === 'like') {
            return items.filter(item => item.like);
        } else {
            return items;
        }
    }

    onUpdateSearch(term) {
        this.setState({term});
    }

    onFilterSelect(filter) {
        this.setState({filter});
    }

    // onToggleLiked(id) {
    //     this.setState(({data}) => {
    //         console.log(data);
    //         const newArr = data.map(item => {
    //             if (item.id === id) {
    //                 item.like = !item.like;
    //             }
    //             console.log(item);
    //             return item;
    //         });

    //         console.log(newArr);

    //         return {
    //             data: newArr
    //         }
    //     });
    // }

    render() {
        const {data, term, filter} = this.state;

        const liked = data.filter(item => item.like).length;
        const allPosts = data.length;
        const visiblePosts = this.filterPosts(this.searchPost(data, term), filter);

        return (
            <div className="app">
                <AppHeader
                    liked={liked}
                    allPosts={allPosts}/>
                <div className="search-panel d-flex">
                    <SearchPanel
                        onUpdateSearch={this.onUpdateSearch}/>
                    <PostStatusFilter
                        filter={filter}
                        onFilterSelect={this.onFilterSelect}/>
                </div>
                <PostList
                    posts={visiblePosts}
                    onDelete={this.deleteItem}
                    onToggleImportant={this.onToggleImportant}
                    onToggleLiked={this.onToggleLiked}/>
                <PostAddForm
                    onAdd={this.addItem}/>
            </div>
        )
    }    
}
import React, { useState, useEffect, createContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({children}) => {

    const [githubUser, setGithubUser] = useState(mockUser);
    const [repos, setRepos] = useState(mockRepos);
    const [followers, setFollowers] = useState(mockFollowers);

    //Requests Loading
    const [requests, setRequests] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    //Error
    const [error, setError] = useState({show: false, msg: ''})
    //Check requests
    const checkRequests = () => {
        axios(`${rootUrl}/rate_limit`).then(({data}) => {
            // console.log('dataRequests', data)
            let {rate: {remaining}} = data
            // remaining = 0
            setRequests(remaining)
            if(remaining === 0){
                toggleError(true, 'Sorry, bạn đã hết lượt truy cập')
            }
        }).catch((error) => {
            console.log('error', error)
        })
    }

    const searchGithubUser = async (user) => {
        toggleError()
        setIsLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`).catch((error) => console.log(error))
        if(response){
            setGithubUser(response.data)
            const {followers_url, login} = response.data
            const promise1 = axios(`${rootUrl}/users/${login}/repos?per_page=100`)
            const promise2 = axios(`${followers_url}?per_page=100`)
            const promise = [promise1, promise2]
            await Promise.allSettled(promise).then((result) => {
                // console.log('result', result)
                const [reposss, followers] = result
                console.log('repos', reposss)
                const status = "fulfilled";
                if(reposss.status === status){
                    setRepos(reposss.value.data)
                }
                if(followers.status === status){
                    setFollowers(followers.value.data)
                }
            })
        }else{
            toggleError(true, 'Không tìm thấy người dùng yêu cầu')
        }
        checkRequests()
        setIsLoading(false)
    }

    //Error
    function toggleError (show = false, msg = ""){
        setError({show, msg})
    }

    useEffect( checkRequests, [])

    return (
        <GithubContext.Provider value = {{githubUser, repos, followers, requests, error, searchGithubUser, isLoading}}>{children}</GithubContext.Provider>
        
    )
}
export {GithubProvider, GithubContext}
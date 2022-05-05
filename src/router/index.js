import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login";
import Index from "../views/Index";
import store from "../store";
import BoardDetails from "../components/BoardDetails";
import {initMenu} from "@/utils/menu";

Vue.use(VueRouter);

const routes = [
    {
        //登录页面组件
        path: '/login',
        name: Login,
        component: Login
    },
    // {
    //     //新的首页
    //     path: '/',
    //     name: Index,
    //     redirect: '/home',
    //     component: Index,
    //     meta: {
    //         requireAuth: true
    //     }
    // },
    // {
    //     path: '/',
    //     name: Index,
    //     redirect: '/home',
    //     component: Index,
    //     children: [
    //         {
    //             path: 'boardDetails',
    //             name: '公告详情',
    //             component: BoardDetails,
    //         },
    //     ],
    //     meta: {
    //         requireAuth: true
    //     }
    // },
    {
        path: '/board',
        name: "board",
        meta: {
            title: "公告"
        },
        component: Index,
        children: [
            {
                path: 'boardDetails',
                name: 'boardDetails',
                meta: {
                    title: "公告详情"
                },
                component: () => import("../components/BoardDetails"),
            },
        ]
    },
    {
        path: '/user',
        name: "user",
        meta: {
            title: "用户"
        },
        component: Index,
        children: [
            {
                path: 'center',
                name: 'center',
                meta: {
                    title: "用户中心"
                },
                component: () => import("../views/common/Center"),
            },
        ]
    },
    {
        path: '/',
        name: "index",
        redirect: '/home',
        meta: {
            title: "主页"
        },
        component: Index,
        children: [
            {
                path: 'home',
                name: 'home',
                meta: {
                    title: "主页"
                },
                component: () => import("../views/common/Home"),
            },
        ]
    },
    {
        path: '/info-manage',
        name: "info-manage'",
        redirect: '/info-manage/student',
        component: Index,
        meta: {
            title: "信息管理"
        },
        children: [
            // {
            //     path: 'center',
            //     name: 'center',
            //     meta: {
            //         title: "用户中心"
            //     },
            //     component: () => import("../views/common/Center"),
            // },
            // {
            //     path: 'teacher',
            //     name: 'teacher',
            //     meta: {
            //         title: "教师信息管理"
            //     },
            //     component: () => import("../views/admin/TeacherInfoManage"),
            // },
            {
                path: 'student',
                name: 'student',
                meta: {
                    title: "学生信息管理"
                },
                component: () => import("../views/admin/StudentInfoManage"),
            },
            {
                path: 'personal',
                name: 'personal',
                meta: {
                    title: "个人信息管理"
                },
                component: () => import("../views/admin/PersonalInfoManage"),
            },
        ]
    },
    {
        path: '/affairs-manage',
        name: "affairs-manage'",
        // redirect: '/affairs-manage/course',
        component: Index,
        meta: {
            title: "教务管理"
        },
        children: [
            {
                path: 'course',
                name: 'course',
                meta: {
                    title: "课程管理"
                },
                component: () => import("../views/admin/CourseManage"),
            },
            // {
            //     path: 'academy',
            //     name: 'academy',
            //     meta: {
            //         title: "学院管理"
            //     },
            //     component: () => import("../views/admin/AcademyManage"),
            // },
            {
                path: 'board',
                name: 'board',
                meta: {
                    title: "公告管理"
                },
                component: () => import("../views/admin/PublishBoard"),
            }
        ]
    },
    {
        path: '/score-manage',
        name: "score-manage'",
        // redirect: '/affairs-manage/course',
        component: Index,
        meta: {
            title: "成绩管理"
        },
        children: [
            {
                path: 'course',
                name: 'course',
                meta: {
                    title: "成绩管理"
                },
                component: () => import("../views/admin/ScoreUpload"),
            },
        ]
    },
    {
        path: '/select',
        name: "select'",
        redirect: '/select/select-course',
        component: Index,
        meta: {
            title: "选课"
        },
        children: [
            {
                path: 'select-course',
                name: 'select-course',
                meta: {
                    title: "学生选课"
                },
                component: () => import("../views/student/SelectCourse"),
            },
            {
                path: 'student-info',
                name: 'student-info',
                meta: {
                    title: "学生信息查询"
                },
                component: () => import("../views/student/StudentInfo"),
            },
        ]
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    //守卫
    //添加loading效果
    store.state.user = sessionStorage.getItem("user");

    if (to.path === '/login') {
        //钩子函数
        next();
    } else {
        if (window.localStorage.getItem('user') || window.sessionStorage.getItem('user')) {
            console.log("router==",router)
            let user = JSON.parse(window.localStorage.getItem('user')) //1--管理员；2--学生
            let userRoutes = []
            // user.role = 1
            if(user.status === 1) {
                userRoutes = routes.slice(3);
            } else if (user.status === 2) {
                userRoutes = routes.slice(routes.length - 1)
                userRoutes.unshift(routes[3])
            }
            console.warn("user===",user)
            // initMenu(routes.slice(3), store);
            initMenu(userRoutes, store);
            next();
        } else {
            location.replace('/login');
        }
    }
});

router.afterEach(router => {
    //添加一个loading加载完成的效果
});

export default router

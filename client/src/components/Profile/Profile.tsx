import React, { ReactElement, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser, logout, updateAvatar } from '../../store/actions/user/userAction'
import { ROUTES } from '../../routes'
import { Button, Form, Popconfirm, Modal, Slider, Menu, Skeleton } from 'antd'
import { LogoutOutlined, DeleteOutlined, CloudUploadOutlined, SafetyOutlined, UserOutlined, LockOutlined } from '@ant-design/icons'
import { ReactComponent as CheckIcon } from './images/check.svg'
import { CropImage } from '../../lib/cropImage'
import { Account } from './components/Account'
import { Personal } from './components/Personal'
import { Secure } from './components/Secure'
import './Profile.scss'
import { dataURLtoFile } from '../../lib/dataURLtoFile'
import moment from 'moment'
import { STATIC_URL } from '../../http'

type menuMode = 'vertical' | 'horizontal' | 'inline'

export const Profile = () => {
    const user = useSelector((state: any) => state.user.user.data)
    const isAuth = useSelector((state: any) => state.user.isAuth)
    const isAppInit = useSelector((state: any) => state.user.init)
    const loading = useSelector((state: any) => state.user.loadingComponent)

    const [userImage, setUserImage] = useState<any>(null)
    const [editor, setEditor] = useState<any>(null)
    const [imageScale, setImageScale] = useState<number>(1)

    const [showImageModal, setShowImageModal] = useState<boolean>(false)
    const [imageModalSize, setImageModalSize] = useState<number>(350)

    const [menuSection, setMenuSection] = useState<ReactElement>(<Account />)
    const [activeMenuLink, setActiveMenuLink] = useState<string>('account')
    const [menuMode, setMenuMode] = useState<menuMode>('inline')

    const params = useParams()
    const navigate = useNavigate()

    const profileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        setUserImage(file)
        setShowImageModal(true)
        e.target.value = ''
    }

    const onCrop = async () => {
        if (editor) {
            const url = editor.getImageScaledToCanvas().toDataURL()
            const date = moment().format('DDMMYYY-HHmmss')
            const file = dataURLtoFile(url, `${date}_${user.id}.png`)

            const formData = new FormData()
            formData.append('avatar', file)

            dispatch(updateAvatar(formData))
            setShowImageModal(false)
            setImageScale(1)
        }
    }

    const dispatch = useDispatch()

    const logoutHandler = () => {
        try {
            dispatch(logout())
        } catch (e) {
            console.log(e)
        }
    }

    const deleteHandler = () => {
        try {
            dispatch(deleteUser())
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!isAuth && isAppInit) {
            navigate('/login')
        }

    }, [isAuth, isAppInit, navigate])

    const changeMenuSection = (section?: string) => {
        switch (section) {
            case 'account':
                setMenuSection(<Account />)
                break
            case 'personal':
                setMenuSection(<Personal />)
                break
            case 'secure':
                setMenuSection(<Secure />)
                break
            case 'verified':
                setMenuSection(<Account />)
                navigate('/profile/account')
                showVerifiedModal()
                break
            default:
                setMenuSection(<Account />)
                navigate('/profile/account')
        }
    }

    const showVerifiedModal = () => {
        setTimeout(() => {
            Modal.success({
                content: (
                    <div className="email-verified-modal">
                        <CheckIcon />
                        <h3>Email has been successfully verified!</h3>
                    </div>
                ),
                centered: true,
                icon: null,
                closable: true,
                maskClosable: true
            })
        }, 1000)
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        handleWindowSizeChange()
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    useEffect(() => {
        if (params) {
            changeMenuSection(params.section)
            setActiveMenuLink(params.section!)
        }
        // eslint-disable-next-line
    }, [params])

    const handleWindowSizeChange = () => {
        const screenWidth = window.screen.width

        setImageModalSize(screenWidth <= 576 ? 350 : 250)
        setMenuMode(screenWidth <= 992 ? 'horizontal' : 'inline')
    }

    return (
        <div className="Profile">
            <div className="Profile__header">
                { isAppInit ?
                <div
                    className="Profile__image"
                    style={{ backgroundImage: `url(${STATIC_URL}/images/${user?.image})` }}
                >
                    <label className="Profile__image-upload">
                        <CloudUploadOutlined style={{ color: '#EEE', fontSize: 40 }} />
                        <input
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                            onChange={profileImageChange}
                        />
                    </label>
                    
                </div>
                : <Skeleton.Avatar className="Profile__image" active style={{width: 200, height: 200 }} shape="circle" /> }
                <div className="Profile__info">
                    <div className="Profile__username">
                        { isAppInit ?
                            <div>{user?.username}'s <span>Profile</span></div>
                        : <Skeleton.Input active size="default" />
                    }
                    </div>
                    <div className="Profile__actions">
                        <Button className="Profile__action" icon={<LogoutOutlined /> } onClick={logoutHandler} loading={loading === 'logout'}>Log out</Button>
                        <Popconfirm
                            title="Are you sure to delete your account?"
                            okText="Yes"
                            cancelText="Cancel"
                            onConfirm={deleteHandler}
                        >
                            <Button className="Profile__action" icon={<DeleteOutlined />} loading={loading === 'delete'} danger>Delete account</Button>
                        </Popconfirm>
                    </div>
                </div>
            </div>
            <div className="Profile__data">
                <Menu
                    onClick={(section: any) => changeMenuSection(section.key)}
                    defaultSelectedKeys={['account']}
                    selectedKeys={[activeMenuLink]}
                    mode={menuMode}
                >
                    <Menu.Item key="account" icon={<SafetyOutlined />}>
                        <Link to={ROUTES.profile.account}>Account</Link>
                    </Menu.Item>
                    <Menu.Item key="personal" icon={<UserOutlined />}>
                        <Link to={ROUTES.profile.personal}>Personal</Link>
                    </Menu.Item>
                    <Menu.Item key="secure" icon={<LockOutlined />}>
                        <Link to={ROUTES.profile.secure}>Secure</Link>
                    </Menu.Item>
                </Menu>

                    { isAppInit ?
                        menuSection
                        : <div className="Profile__form">
                            <Skeleton active paragraph={{ rows: 0 }} />
                            <Skeleton.Input style={{ width: '100%' }} active size="default" />
                            <Skeleton active paragraph={{ rows: 0 }} />
                            <Skeleton.Input style={{ width: '100%' }} active size="default" />
                            <Skeleton active paragraph={{ rows: 0 }} />
                            <Skeleton.Input style={{ width: '100%' }} active size="default" />
                        </div>
                    }
            </div>


            <Modal
                title="Change profile picture"
                visible={showImageModal}
                onOk={onCrop}
                okText="Save"
                onCancel={() => setShowImageModal(false)}
            >
                { userImage && (
                    <div className="modal-container">
                        <CropImage
                            src={userImage}
                            setEditor={(editor: any) => setEditor(editor)}
                            scale={imageScale}
                            isMobile={imageModalSize}
                        />
                        <Slider
                            defaultValue={1}
                            min={1}
                            max={5}
                            step={0.1}
                            value={imageScale}
                            onChange={(value) => setImageScale(value)}
                            tooltipVisible={false}
                            style={{ width: imageModalSize }}
                        />
                    </div>
                ) }
            </Modal>

        </div>
    )
}
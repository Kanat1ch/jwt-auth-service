import React, { ReactElement, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { Button, Form, Popconfirm, Modal, Slider, Menu } from 'antd'
import { LogoutOutlined, DeleteOutlined, CloudUploadOutlined, SafetyOutlined, UserOutlined, LockOutlined } from '@ant-design/icons'
import { CropImage } from '../../lib/cropImage'
import { Account } from './components/Account'
import { Personal } from './components/Personal'
import { Secure } from './components/Secure'
import './Profile.scss'

export const Profile = () => {
    const [file, setFile] = useState<any>(null)
    const [userImage, setUserImage] = useState<any>('')
    const [editor, setEditor] = useState<any>(null)
    const [imageScale, setImageScale] = useState<number>(1)

    const [showImageModal, setShowImageModal] = useState<boolean>(false)

    const [menuSection, setMenuSection] = useState<ReactElement>(<Account />)

    const params = useParams()
    const navigate = useNavigate()

    const profileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        setFile(file)
        setShowImageModal(true)
    }

    const onCrop = () => {
        if (editor) {
            const url = editor.getImageScaledToCanvas().toDataURL()
            console.log('onCrop: ', url)
            setUserImage(url)
        }
    }

    const isMobile = (): boolean => {
        const screenWidth = window.screen.width

        if (screenWidth < 576) {
            return true
        } else {
            return false
        }
    }

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
            default:
                setMenuSection(<Account />)
                navigate('/profile/account')
        }
    }

    useEffect(() => {
        changeMenuSection(params.section)
    }, [params])

    return (
        <div className="Profile">
            <div className="Profile__header">
                <div className="Profile__image">
                    <label className="Profile__image-upload">
                        <CloudUploadOutlined style={{ color: '#EEE', fontSize: 40 }} />
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                            onChange={profileImageChange}
                        />
                    </label>
                    
                </div>
                <div className="Profile__info">
                    <div className="Profile__username">
                        Kanat1ch's <span>Profile</span>
                    </div>
                    <div className="Profile__actions">
                        <Button className="Profile__action" icon={<LogoutOutlined />}>Log out</Button>
                        <Popconfirm
                            title="Are you sure to delete your account?"
                            okText="Yes"
                            cancelText="Cancel"
                        >
                            <Button className="Profile__action" icon={<DeleteOutlined />} danger>Delete account</Button>
                        </Popconfirm>
                    </div>
                </div>
            </div>
            <div className="Profile__data">
                <Menu
                    onClick={(section: any) => changeMenuSection(section.key)}
                    defaultSelectedKeys={['account']}
                    mode="inline"
                    style={{ width: 220 }}
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

                <Form
                    className="Profile__form"
                    name="basic"
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    layout="vertical"
                >
                    {menuSection}
                </Form>
            </div>


            <Modal
                title="Change profile picture"
                visible={showImageModal}
                onOk={onCrop}
                okText="Save"
                onCancel={() => setShowImageModal(false)}
            >
                { file && (
                    <div className="modal-container">
                        <CropImage
                            src={file}
                            setEditor={(editor: any) => setEditor(editor)}
                            scale={imageScale}
                            isMobile={isMobile()}
                        />
                        <Slider
                            defaultValue={1}
                            min={1}
                            max={5}
                            step={0.1}
                            value={imageScale}
                            onChange={(value) => setImageScale(value)}
                            tooltipVisible={false}
                            style={{ width: isMobile() ? 250 : 350 }}
                        />
                    </div>
                ) }
            </Modal>

        </div>
    )
}
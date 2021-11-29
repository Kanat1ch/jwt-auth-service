import React from 'react'
import AvatarEditor from 'react-avatar-editor'

export const CropImage = ({ src, setEditor, scale, isMobile }: any) => {
    return (
        <div className="AvatarEditor">
            <AvatarEditor
                image={src}
                border={0}
                borderRadius={1000}
                width={isMobile ? 250 : 350}
                height={isMobile ? 250 : 350}
                color={[0, 0, 0, 0.5]}
                scale={scale}
                ref={setEditor}
            />
        </div>
    )
}
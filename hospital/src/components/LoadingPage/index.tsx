import React from 'react'
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const loadingPage: React.CSSProperties = {
    height: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};
const content: React.CSSProperties = {
    padding: '50px',
}

const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />

export default function View() {
    return (
        <div style={loadingPage}>
            <Spin tip="加载中..." size="large" indicator={antIcon}>
                <div style={content} />
            </Spin>
        </div>
    )
}

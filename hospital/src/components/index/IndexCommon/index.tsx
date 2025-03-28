import { Avatar, Card, Carousel, List, Table } from 'antd'
import style from './index.module.scss'

import { useTranslation } from 'react-i18next';
// 引入cookie



const data = [
  {
    title: '张三',
    content: '主治医师，学士学位，毕业于郑州大学临床医学系。从事妇科工作十余年。'
  },
  {
    title: '李四',
    content: '执业医师 从事泌尿系临床工作多年，在泌尿系疑难诊治中积累了丰富的临床经验。'
  },
  {
    title: '王五',
    content: '副主任医师,1990年毕业于山西省中医学院，本科学历。现任大同市中医院皮肤科主任'
  },
  {
    title: '王麻子',
    content: '主任医师 管理学硕士 德阳市人民医院副院长,从事神经内科医、教、研工作30余年'
  },
];

export default function View() {

  const { t } = useTranslation();

  return (
    <div className={style.allPage}>
      <div className={style.topBox}>
        <Card size='small' title={t('index.authoritative_doctors')} bordered={false} style={window.innerWidth < 700 ? { marginTop: '15px' } : { width: '49.5%' }}>
          <List
            itemLayout="horizontal"
            dataSource={data}
            size='small'
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description={item.content}
                />
              </List.Item>
            )}
          />
        </Card>
        <Card size='small' title={t('index.hospital_photos')} bordered={false} style={window.innerWidth < 700 ? { marginTop: '15px' } : { width: '49.5%' }}>
          <Carousel style={window.innerWidth < 700 ? { width: '100%' } : { width: '600px', margin: 'auto' }} autoplay>
            <div>
              <img style={window.innerWidth < 700 ? { width: '100%' } : { width: '600px', height: '250px' }} src="src/assets/img/1.jpg" alt="" />
            </div>
            <div>
              <img style={window.innerWidth < 700 ? { width: '100%' } : { width: '600px', height: '250px' }} src="src/assets/img/2.jpg" alt="" />
            </div>
            <div>
              <img style={window.innerWidth < 700 ? { width: '100%' } : { width: '600px', height: '250px' }} src="src/assets/img/3.jpg" alt="" />
            </div>
          </Carousel>
        </Card>
      </div>
    </div>
  )
}
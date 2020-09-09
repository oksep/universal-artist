export interface FeedModel {
  createTime: string;
  id: string;
  img: string;
  size: 'normal' | 'large';
  subTitle: string;
  tags?: string[];
  title: string;
}

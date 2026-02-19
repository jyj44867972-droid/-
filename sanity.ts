import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'Yejin Portfolio Upload',

  projectId: 'aoav5un7',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: [
      {
        name: 'project',
        title: '포트폴리오 작업물',
        type: 'document',
        fields: [
          { name: 'number', title: '숫자 (예: 01, 02)', type: 'string' },
          { name: 'title', title: '프로젝트 제목', type: 'string' },
          { name: 'description', title: '짧은 설명 (메인 화면용)', type: 'text' },
          { name: 'longDescription', title: '상세 설명 (클릭 시 나오는 긴 글)', type: 'text' },
          { name: 'aspectRatio', title: '이미지 비율 (예: 16/9, 비워둬도 됨)', type: 'string' },
          {
            name: 'mainImage',
            title: '메인 썸네일 이미지',
            type: 'image',
            options: { hotspot: true }
          },
          {
            name: 'images',
            title: '상세 페이지 사진들 (여러 장 업로드)',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }]
          }
        ]
      }
    ],
  },
})
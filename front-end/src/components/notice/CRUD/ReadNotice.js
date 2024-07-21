import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CRUDHeader from './CRUDHeader';
import './CRUD.css';

function ReadNotice() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    // 백엔드에서 게시글과 댓글 목록을 가져옴
    const fetchPost = async () => {
      try {
        const postResponse = await axios.get(`/notice/PostView/${no}`);
        setPost(postResponse.data.post);

        // 이미지 로드
        if (postResponse.data.post.file_data) {
          const imageResponse = await axios.get(`/notice/image/${no}`, {
            responseType: 'arraybuffer',
          });
          const base64 = btoa(
            new Uint8Array(imageResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          setImageSrc(`data:image/jpeg;base64,${base64}`);
        }

        setLoading(false);
      } catch (error) {
        console.error('게시글을 불러오는 중 오류 발생:', error);
        setError('게시글을 불러오는 중 오류 발생');
        setLoading(false);
      }
    };

    fetchPost();
  }, [no]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');

    if (confirmDelete) {
      try {
        await axios.delete(`/notice/Postview/${no}/process/delete`);
        alert('게시글이 삭제되었습니다.');
        navigate('/notice');
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert('삭제 권한이 없습니다.');
        } else {
          console.error('게시글 삭제 중 오류 발생:', error);
          alert('게시글 삭제 중 오류가 발생했습니다.');
        }
      }
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const { title, created_date, content } = post;

  return (
    <div className="Read_all">
      <div>
        <div className="header_layout">
          <CRUDHeader title="공지사항" />
        </div>
        <div className="ReadTitle">{title}</div>
        <div className="infoUpdateDelete">
          <div className="info">
            <div>관리자</div>
            <div>{created_date}</div>
          </div>
          <div className="updateDelete">
            <Link to={`/notice/Postview/${no}/process/update`}>수정</Link>
            <div onClick={handleDelete} style={{ cursor: 'pointer' }}>
              삭제
            </div>
          </div>
        </div>
        <div className="explainText">
          <p>HOPINFO는 서로의 아픔을 공감하고 위로하는 커뮤니티입니다.</p>
          <p>회원들끼리 서로 존중하고, 응원과 조언을 아끼지 않는 자랑스러운 회원이 되도록 합시다.</p>
        </div>
        <div className="ReadContent">
          {imageSrc && <img src={imageSrc} alt="Post" />}
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}

export default ReadNotice;

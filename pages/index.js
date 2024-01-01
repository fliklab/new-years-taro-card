import React, { useEffect, useState } from "react";
import { PageSEO } from "@/components/SEO";
import Head from "next/head";
import Card from "./Card";

const CARD_DEFAULT =
  "http://k.kakaocdn.net/dn/conr6V/bl4CKgQKwVl/0uOXFVu78ptVG536RNVWZ1/kakaolink40_original.png";

const CARD_BACK =
  "http://k.kakaocdn.net/dn/bVbmvz/bl4CL7Gdacv/9ZFm0v2pVLX9uZiJecOqi1/kakaolink40_original.png";

export const getServerSideProps = async (context) => {
  const { title, desc, image } = context.query;
  return {
    props: {
      title: title ?? "",
      desc: desc ?? "",
      image: image ?? "",
      viewMode: title && desc && image ? true : false,
    },
  };
};

const NewYearsTarrot = ({
  title: queryTitle,
  desc: queryDesc,
  image: queryImage,
  viewMode: isViewMode,
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loadingMsg, setLoadingMsg] = useState();
  const [imageUrl, setImageUrl] = useState(queryImage);

  const [receiver, setReceiver] = useState("");
  const [sender, setSender] = useState("");
  const [relation, setRelation] = useState("");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    // 초기값 설정
    if (queryTitle) setTitle(queryTitle);
    if (queryDesc) setDesc(queryDesc);
    if (queryImage) setImageUrl(queryImage);
  }, [queryTitle, queryDesc, queryImage]);

  const handleChangeSender = (event) => {
    setSender(event.target.value);
  };
  const handleChangeReceiver = (event) => {
    setReceiver(event.target.value);
  };
  const handleChangeRelation = (event) => {
    setRelation(event.target.value);
  };
  const handleChangeTopic = (event) => {
    setTopic(event.target.value);
  };

  // OpenAI 활용하여 메시지를 만드는 함수
  const getAIMessage = async (body) => {
    const { topic, receiver, sender, relation } = body;
    try {
      const response = await fetch("/api/new-year/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      console.log("chat completion data", {
        data,
        message: data.result.choices[0].message.content,
      });
      return data.result.choices[0].message.content;
    } catch (error) {
      console.error(error);
    }
  };

  // OpenAI활용하여 이미지를 만드는 함수
  const getAIImage = async ({ topic }) => {
    try {
      const response = await fetch("/api/new-year/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: `${topic}`,
        }),
      });
      const responseJson = await response.json();
      return responseJson?.result?.data?.[0]?.url;
    } catch (error) {
      console.error(error);
    }
  };

  // 카카오톡 공유하는 함수
  const sendKakaoShare = ({ title, image, desc, path }) => {
    window.Kakao.Share.sendCustom({
      templateId: 102227,
      templateArgs: {
        title: title,
        image: image,
        desc: desc,
        path: path,
        button: "보러가기",
      },
    });
  };

  // short url 만드는 함수
  const getShortenUrl = async ({ originalURL }) => {
    try {
      const response = await fetch("/api/shortenUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalURL: `${originalURL ?? ""}`,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
      <PageSEO
        title="당신의 신년 운세는?"
        description="AI가 전해주는 2024 운세 선물"
      />
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className="p-6 md:p-8"
        style={{ fontFamily: "'Gowun Batang', serif" }}
      >
        {isViewMode ? (
          <Card title={title} description={desc} imgSrc={imageUrl} />
        ) : (
          <div className="p-6 md:p-8">
            <div
              className="mb-4 text-3xl font-bold"
              style={{ fontFamily: "'Gowun Batang', serif" }}
            >
              당신의 새해 운세는?
            </div>
            <div
              className="mb-4 text-lg font-bold"
              style={{ fontFamily: "'Gowun Batang', serif" }}
            >
              AI가 전해주는
              <br />
              2024 운세 선물
            </div>
            <div
              className="mb-4 text-lg"
              style={{ fontFamily: "'Gowun Batang', serif" }}
            >
              도움이 되는 운세를 보내드릴게요 😊
            </div>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="mb-2 block font-medium text-gray-700 dark:text-gray-300"
              >
                받는 사람
              </label>
              <input
                type="text"
                id="receiver"
                name="receiver"
                value={receiver}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-black dark:text-white"
                onChange={handleChangeReceiver}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="mb-2 block font-medium text-gray-700 dark:text-gray-300"
              >
                보내는 사람
              </label>
              <input
                type="text"
                id="sender"
                name="sender"
                value={sender}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-black dark:text-white"
                onChange={handleChangeSender}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="mb-2 block font-medium text-gray-700 dark:text-gray-300"
              >
                {receiver}님은 보내는 사람과 어떤 관계인가요?
              </label>
              <input
                type="text"
                id="relation"
                name="relation"
                value={relation}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-black dark:text-white"
                onChange={handleChangeRelation}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="mb-2 block font-medium text-gray-700 dark:text-gray-300"
              >
                {receiver}님이 요즘 푹 빠져있는 관심사는 뭘까요?
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={topic}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-black dark:text-white"
                onChange={handleChangeTopic}
              />
            </div>

            {imageUrl ? (
              <div className="mb-8">
                <label
                  htmlFor="image"
                  className="mb-2 block font-medium text-gray-700 dark:text-gray-300"
                >
                  이미지
                </label>
                <div id="preview" className="mt-5">
                  <Card title={title} description={desc} imgSrc={imageUrl} />
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        )}
        <button
          onClick={async () => {
            // 메시지 생성하기
            setLoadingMsg("카드를 생성하는 중입니다...");
            const message = await getAIMessage({
              topic,
              receiver,
              sender,
              relation,
            });

            setLoadingMsg("이미지를 생성하는 중입니다...");
            const generatedImage =
              (await getAIImage({
                topic,
              })) ?? CARD_DEFAULT;

            setImageUrl(generatedImage);
            console.log("generatedImage", generatedImage);

            setLoadingMsg("카드를 공유하는 중입니다...");
            const shareTitle = `${sender}님의 선물`;
            const shareDesc = `${sender}님이 ${receiver}님에게 보내는 2024년 운세 이용권입니다.`;

            const title = `${receiver}님의 운세입니다.`;

            // 공유할 short link 만들기
            const { path } = await getShortenUrl({
              originalURL: `https://techbukket.com/play/new-years-tarrot?title=${title}&desc=${message}&image=${generatedImage}`,
            });

            // 카카오톡 공유하기
            await sendKakaoShare({
              title: shareTitle,
              image: CARD_BACK,
              desc: shareDesc,
              path: path,
            });
            setLoadingMsg(undefined);
          }}
          className={
            "w-full rounded-lg bg-primary-500 p-3 text-white shadow-md hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          }
          disabled={!!loadingMsg}
        >
          {loadingMsg ?? "공유하기"}
        </button>
      </div>
    </div>
  );
};
export default NewYearsTarrot;

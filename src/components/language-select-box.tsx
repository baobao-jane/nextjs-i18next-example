import { useRouter } from "next/router";
import { FC } from "react";

const LanguageSelectBox: FC = () => {
  const router = useRouter();
  const handleLocale = (event: any) => {
    router.push("/", "/", { locale: event.target.value });
  };

  return (
    <div style={{ marginBottom: 20, textAlign: "center" }}>
      <p style={{ marginBottom: 10 }}>언어를 선택하세요</p>
      <select onChange={handleLocale} id="language-box" name="language-box">
        <option value="ko">한국어</option>
        <option value="en">영어</option>
        <option value="ja">일본어</option>
      </select>
    </div>
  );
};

export default LanguageSelectBox;

import { useVerseContext } from "../utils/VerseContext"

const Copyright = () => {
  const { translation } = useVerseContext()

  let content

  switch (translation) {
    case "NIV":
      content = (
        <p>
          The Holy Bible, New International Version® NIV® Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.® Used by
          Permission of Biblica, Inc.® All rights reserved worldwide.
        </p>
      )
      break
    case "KJV":
      content = <p>The Holy Bible, King James Version. Standardized Text of 1769 Public Domain.</p>
      break
    case "NKJV":
      content = <p>The Holy Bible, New King James Version, Copyright © 1982 Thomas Nelson. All rights reserved.</p>
      break
    case "ESV":
      content = (
        <p>
          The Holy Bible, English Standard Version® (ESV®), copyright © 2001 by Crossway, a publishing ministry of Good
          News Publishers.
        </p>
      )
      break
    default:
      content = <p>Unknown translation.</p>
      break
  }

  return <div className=" text-white text-center text-sm">{content}</div>
}
export default Copyright

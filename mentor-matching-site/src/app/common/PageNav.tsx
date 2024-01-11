import { useEffect, useState } from "react"
import FormGroupRows from "./forms/FormGroupRows";
import { Button } from "@mui/material";

interface Page {
  pageId: string | number
  label: string
  component: React.ReactElement
}

interface PageNavProps {
  pages: Page[]
  defaultPage: string | number
}

function PageNav(props: PageNavProps) {
  const [currentPageId, setCurrentPageId] = useState(props.defaultPage);

  useEffect(() => {
    console.log(props.pages);
  });

  function currentPage() {
    console.log(props.defaultPage)
    console.log(currentPageId)
    const pageComponent = props.pages.forEach(page => {
      if (page.pageId == currentPageId) {
        return page;
      }
    });
    console.log("current page")
    console.log(pageComponent)
    return (
      <>{pageComponent}</>
    );
  }

  return (
    <div>
      <FormGroupRows>
        {props.pages.map(page =>
          <Button onClick={() => { setCurrentPageId(page.pageId); }}>{page.label}</Button>
        )}
      </FormGroupRows>
      {currentPage()}
    </div>

  );
}

export default PageNav;
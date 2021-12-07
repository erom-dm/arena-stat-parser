import React, { useMemo, useState } from "react";
import { ModdedArenaMatch } from "../Types/ArenaTypes";
import MatchItem from "./MatchItem";
import useInfiniteScroll from "react-infinite-scroll-hook";

export type matchListProps = {
  matches: ModdedArenaMatch[];
};

const LIST_ITEMS_PER_STEP = 10;

const MatchList: React.FC<matchListProps> = ({ matches }) => {
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState<boolean>(false);
  const matchItems = useMemo(() => {
    return matches
      .sort((a, b) => b.enteredTime - a.enteredTime)
      .map((match) => <MatchItem match={match} key={match.enteredTime} />);
  }, [matches]);
  const slicedItems = useMemo(
    () => matchItems?.slice(0, LIST_ITEMS_PER_STEP * step),
    [matchItems, step]
  );

  const loadMore = () => setStep(step + 1);
  const hasMore = slicedItems?.length < matchItems?.length;

  const [sentryRef] = useInfiniteScroll({
    loading: loading,
    hasNextPage: hasMore,
    onLoadMore: () => {
      setLoading(true);
      loadMore();
      setLoading(false);
    },
  });

  return (
    <div className="match-list">
      {slicedItems}
      {(loading || hasMore) && <div ref={sentryRef}>Loading...</div>}
    </div>
  );
};

export default MatchList;

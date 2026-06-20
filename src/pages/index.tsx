import * as React from 'react';

import { PublicLayout } from 'src/layouts/PublicLayout';
import { WorkforceActivity } from 'src/modules/WorkforceActivity';

export default function HomePage(): React.ReactElement {
  return <WorkforceActivity />;
}

HomePage.getLayout = function getLayout(page: React.ReactElement): React.ReactElement {
  return <PublicLayout>{page}</PublicLayout>;
};

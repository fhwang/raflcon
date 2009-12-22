class PrizeCategory < ActiveRecord::Base
  has_many :giveaways
  
  validates_presence_of :name, :count
  validates_uniqueness_of :name
  
  def self.unfilled
    find_by_sql <<-SQL
      select * from (
      select pc.*, pc.count-sum(coalesce(g.count, 0)) as unfilled_count
        from prize_categories pc left outer join giveaways g on
             pc.id = g.prize_category_id
        group by pc.id
      ) as inner
      where unfilled_count > 0
    SQL
  end
  
  def unfilled_count
    if attributes['unfilled_count']
      attributes['unfilled_count'].to_i
    end
  end
end

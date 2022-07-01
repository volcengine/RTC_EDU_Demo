#pragma once
#include "data_mgr.h"
#include <QJsonObject>
#include <QJsonArray>

namespace Edu {

	enum DataSourceType
	{
		RTS_JSON_DATA
	};

	template<DataSourceType T>
	class DataSource {
	public:
		static DataSource<T>& instance() { 
			static_assert(false,"the type is not DataSource");
			
			static return; }
	private:
		DataSource() = default;
		~DataSource() = default;
	};

	template<>
	class DataSource<RTS_JSON_DATA> {
	public:
		DataSource(const QJsonObject& source):source_(source) {
		}
		const QJsonObject& source()const {
			return source_;
		}
		~DataSource() = default;
	private:
		QJsonObject source_;
	};

	class DataParser {
	public:
		template<DataSourceType T>
		static void parser_rooms(const DataSource<T>& srouce, Rooms& rooms);
		template<DataSourceType T>
		static void parser_room(const DataSource<T>& srouce, ClassRoom& room);
		template<DataSourceType T>
		static void parser_records(const DataSource<T>& srouce, HistoryRecordList& rescords);
		template<DataSourceType T>
		static void parser_teacher_info(const DataSource<T>& srouce, TeacherInfo& room);

	};
}
